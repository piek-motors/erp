import { Warehouse } from '#root/domains/pdo/warehouse_service.js'
import { materials_stat_container } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { isDuplicateKeyError } from '#root/lib/kysely.js'
import { router } from '#root/lib/trpc/trpc.js'
import {
	db,
	matrixEncoder,
	procedure,
	requireScope,
	Scope,
	TRPCError,
} from '#root/sdk.js'
import type { DB } from 'db'
import { sql } from 'kysely'
import {
	MaterialConstructorMap,
	MaterialShape,
	MaterialShapeAbstractionLayer,
	SupplyReason,
	Unit,
	WriteoffReason,
} from 'models'
import { z } from 'zod'

export type Material = DB.Material & {}

const DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS = 60

const payload = z.object({
	unit: z.enum(Unit),
	shape: z.enum(MaterialShape),
	shape_data: z.any(),
	alloy: z.string().nullable(),
	shortage_prediction_horizon_days: z
		.number()
		.default(DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS),
})
const id_payload = z.object({ id: z.number() })
const update_payload = payload.extend({ id: z.number() })

export const material = router({
	get: procedure.input(id_payload).query(async ({ input: { id } }) => {
		const [material, detailCount] = await Promise.all([
			db
				.selectFrom('pdo.materials')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirstOrThrow(),
			db
				.selectFrom('pdo.details')
				.where(sql<boolean>`(blank->'material'->>0)::int = ${id}`)
				.select(eb => eb.fn.countAll().as('count'))
				.executeTakeFirstOrThrow(),
		])
		return {
			material,
			detailCount: Number(detailCount.count),
			writeoff_stat: {
				monthly: materials_stat_container.writeoffs.monthly?.get(id)?.entries,
				quarterly:
					materials_stat_container.writeoffs.quarterly?.get(id)?.entries,
			},
		}
	}),
	//
	list: procedure.query(() =>
		db
			.selectFrom('pdo.materials as m')
			.selectAll()
			.orderBy('m.label')
			.execute()
			.then(materials => matrixEncoder(materials)),
	),
	//
	create: procedure
		.use(requireScope(Scope.pdo))
		.input(payload)
		.mutation(async ({ input }) => {
			const material = await db
				.insertInto('pdo.materials')
				.values({
					...input,
					label: derive_label(input),
					on_hand_balance: 0,
					linear_mass: 0,
				})
				.returningAll()
				.executeTakeFirstOrThrow()
				.catch(e => {
					if (isDuplicateKeyError(e)) {
						throw new TRPCError({
							code: 'CONFLICT',
							message: 'Материал с таким названием уже существует',
						})
					}
					throw e
				})
			return material
		}),
	//
	delete: procedure
		.use(requireScope(Scope.pdo))
		.input(id_payload)
		.mutation(async ({ input: { id } }) => {
			await db.transaction().execute(async trx => {
				await trx
					.deleteFrom('pdo.operations')
					.where('material_id', '=', id)
					.execute()
				const { label } = await trx
					.deleteFrom('pdo.materials')
					.where('id', '=', id)
					.returning(['label'])
					.executeTakeFirstOrThrow()
				logger.warn(`Material deleted: ${id} ${label}`)
			})
			return {
				success: true,
			}
		}),
	update: procedure
		.use(requireScope(Scope.pdo))
		.input(update_payload)
		.mutation(async ({ input }) => {
			await db
				.updateTable('pdo.materials')
				.set({
					...input,
					label: derive_label(input),
				})
				.where('id', '=', input.id)
				.executeTakeFirstOrThrow()
			return 'ok'
		}),
	//
	supply: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				material_id: z.number(),
				lengthMeters: z.number().gt(0),
				reason: z.enum(SupplyReason),
			}),
		)
		.mutation(({ input, ctx }) =>
			db.transaction().execute(async trx =>
				new Warehouse(trx, ctx.user.id)
					.supplyMaterial(input.material_id, input.lengthMeters, input.reason)
					.then(({ on_hand_balance: stock }) => ({
						qty: stock.toString(),
					})),
			),
		),
	//
	writeoff: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				material_id: z.number(),
				lengthMeters: z.number().gt(0),
				reason: z.enum(WriteoffReason),
				type_data: z.any(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return await db.transaction().execute(async trx => {
				const warehouse = new Warehouse(trx, ctx.user.id)
				const result = await warehouse.subtractMaterial(
					input.material_id,
					input.lengthMeters,
					input.reason,
				)
				return result.on_hand_balance.toString()
			})
		}),
	//
	dict_distinct_alloys: procedure.query(async () =>
		db
			.selectFrom('pdo.materials')
			.select('alloy')
			.distinct()
			.execute()
			.then(res => res.map(e => e.alloy)),
	),
})

type UpdatePayload = z.infer<typeof payload>

function derive_label(input: UpdatePayload) {
	const materialConstructor = MaterialConstructorMap[input.shape]
	const model = new materialConstructor(input.shape_data, '', input.alloy)
	MaterialShapeAbstractionLayer.importShapeData(model, input.shape_data)
	return model.deriveLabel()
}
