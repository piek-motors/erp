import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { router } from '#root/lib/trpc/trpc.js'
import { db, procedure, requireScope, Scope, TRPCError } from '#root/sdk.js'
import { Color } from 'models'
import { z } from 'zod'

export interface DetailInTheGroup {
	id: number
	name: string
	drawing_number: string | null
	group_id: number | null
	colors: Color[]
}

export const detail_groups = router({
	get: procedure
		.input(
			z.object({
				groupId: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const [group, details, directDetails, colorAnnotations] =
				await Promise.all([
					db
						.selectFrom('pdo.detail_group')
						.where('id', '=', input.groupId)
						.select(['id', 'name'])
						.executeTakeFirst(),
					db
						.selectFrom('pdo.detail_group_details as dgd')
						.where('dgd.group_id', '=', input.groupId)
						.leftJoin('pdo.details as d', 'd.id', 'dgd.detail_id')
						.where('d.logical_group_id', 'is', null)
						.select([
							'd.id',
							'd.name',
							'd.drawing_number',
							'd.logical_group_id',
						])
						.orderBy('d.name', 'asc')
						.execute(),
					db
						.selectFrom('pdo.details')
						.select(['id', 'name', 'drawing_number', 'logical_group_id'])
						.where('logical_group_id', '=', input.groupId)
						.execute(),
					db
						.selectFrom('pdo.detail_group_color_annotations')
						.where('group_id', '=', input.groupId)
						.select(['detail_id', 'colors'])
						.execute(),
				])
			if (!group) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Detail group not found',
				})
			}
			const detailsData: DetailInTheGroup[] = [
				...directDetails,
				...details,
			].map(d => ({
				id: d.id as number,
				name: d.name as string,
				drawing_number: d.drawing_number as string | null,
				group_id: d.logical_group_id as number | null,
				colors: colorAnnotations.find(ca => ca.detail_id === d.id)
					?.colors as Color[],
			}))
			return {
				group,
				details: matrixEncoder(detailsData),
			}
		}),
	//
	list: procedure.query(async () =>
		db
			.selectFrom('pdo.detail_group')
			.selectAll()
			.orderBy('name', 'asc')
			.execute(),
	),
	//
	create: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				name: z
					.string()
					.min(3, 'Название группы должно быть не менее 3 символов'),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				const result = await db
					.insertInto('pdo.detail_group')
					.values({
						name: input.name,
					})
					.returning(['id', 'name'])
					.executeTakeFirstOrThrow()

				return result
			} catch (error: any) {
				if (error.code === '23505') {
					// Unique constraint violation
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'A detail group with this name already exists',
					})
				}
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create detail group',
				})
			}
		}),
	//
	update: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				id: z.number(),
				name: z
					.string()
					.min(3, 'Название группы должно быть не менее 3 символов'),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				const result = await db
					.updateTable('pdo.detail_group')
					.set({
						name: input.name,
					})
					.where('id', '=', input.id)
					.returning(['id', 'name'])
					.executeTakeFirst()
				if (!result) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Detail group not found',
					})
				}
				return result
			} catch (error: any) {
				if (error.code === '23505') {
					// Unique constraint violation
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'A detail group with this name already exists',
					})
				}
				if (error instanceof TRPCError) {
					throw error
				}
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to update detail group',
				})
			}
		}),
	//
	delete: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			await db.transaction().execute(async trx => {
				await trx
					.deleteFrom('pdo.detail_group_details')
					.where('group_id', '=', input.id)
					.execute()
				await trx
					.deleteFrom('pdo.detail_group')
					.where('id', '=', input.id)
					.execute()
			})
		}),
	//
	add_details: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				group_id: z.number(),
				detail_ids: z
					.array(z.number())
					.min(1, 'At least one detail must be provided'),
			}),
		)
		.mutation(async ({ input }) => {
			// First check if the group exists
			const group = await db
				.selectFrom('pdo.detail_group')
				.where('id', '=', input.group_id)
				.selectAll()
				.executeTakeFirst()

			if (!group) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Detail group not found',
				})
			}
			// Check if all details exist
			const details = await db
				.selectFrom('pdo.details')
				.where('id', 'in', input.detail_ids)
				.select(['id'])
				.execute()

			if (details.length !== input.detail_ids.length) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'One or more details not found',
				})
			}

			const insertPromises = input.detail_ids.map(detailId =>
				db
					.insertInto('pdo.detail_group_details')
					.values({
						group_id: input.group_id,
						detail_id: detailId,
					})
					.onConflict(oc => oc.columns(['group_id', 'detail_id']).doNothing())
					.execute(),
			)
			await Promise.all(insertPromises)
		}),
	//
	remove_details: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				group_id: z.number(),
				detail_ids: z
					.array(z.number())
					.min(1, 'At least one detail must be provided'),
			}),
		)
		.mutation(async ({ input }) => {
			await db
				.deleteFrom('pdo.detail_group_details')
				.where('group_id', '=', input.group_id)
				.where('detail_id', 'in', input.detail_ids)
				.execute()
		}),
	//
	set_color_annotation: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				group_id: z.number(),
				detail_id: z.number(),
				colors: z.array(z.enum(Color)),
			}),
		)
		.mutation(async ({ input }) => {
			await db
				.insertInto('pdo.detail_group_color_annotations')
				.values(input)
				.onConflict(oc =>
					oc.columns(['group_id', 'detail_id']).doUpdateSet(input),
				)
				.execute()
		}),
})
