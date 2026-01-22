import { ManufacturingOrderStatus as OrderStatus } from 'models'
import z from 'zod'
import { type DB, db, procedure, requireScope, TRPCError } from '#root/deps.js'
import { Day, Scope } from '#root/lib/constants.js'
import { router } from '#root/lib/trpc/trpc.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'

export const orders_mut = router({
	create: procedure
		.use(requireScope(Scope.pdo))
		.input(z.object({ detailId: z.number() }))
		.mutation(({ input, ctx }) =>
			db.transaction().execute(trx =>
				new Manufacturing(trx, ctx.user.id)
					.createOrder(input.detailId)
					.then(order => ({
						...order,
						material_writeoffs: undefined,
					})),
			),
		),
	//
	update_qty: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				id: z.number(),
				qty: z.number(),
			}),
		)
		.mutation(async ({ input: { qty, id } }) => {
			return db.transaction().execute(async trx => {
				const { status } = await db
					.selectFrom('pdo.orders')
					.select('status')
					.where('id', '=', id)
					.executeTakeFirstOrThrow()

				const update: Partial<
					Pick<DB.ProductionOrderTable, 'qty' | 'output_qty'>
				> = {}

				if (OrderStatus.Production === status) {
					update.output_qty = qty
				} else {
					update.qty = qty
					update.output_qty = qty
				}

				await trx
					.updateTable('pdo.orders')
					.set(update)
					.where('id', '=', id)
					.execute()
				return {
					success: true,
				}
			})
		}),
	//
	delete: procedure
		.use(requireScope(Scope.pdo))
		.input(z.object({ id: z.number() }))
		.mutation(({ input, ctx }) =>
			db
				.transaction()
				.execute(async trx =>
					new Manufacturing(trx, ctx.user.id)
						.deleteOrder(input.id)
						.then(() => 'ok'),
				),
		),
	//
	start_preparation: procedure
		.use(requireScope(Scope.pdo))
		.input(z.object({ orderId: z.number() }))
		.mutation(({ input, ctx }) =>
			db.transaction().execute(trx =>
				new Manufacturing(trx, ctx.user.id)
					.startMaterialPreparationPhase(input.orderId)
					.then(() => ({
						success: true,
					})),
			),
		),
	//
	start_production: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				orderId: z.number(),
				qty: z.number(),
				force: z.boolean().optional(),
			}),
		)
		.mutation(({ input, ctx }) =>
			db
				.transaction()
				.execute(trx =>
					new Manufacturing(trx, ctx.user.id).startProductionPhase(
						input.orderId,
						input.qty,
						input.force,
					),
				),
		),
	//
	return_to_production: procedure
		.use(requireScope(Scope.pdo))
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const order = await db
				.selectFrom('pdo.orders')
				.select('finished_at')
				.where('status', '=', OrderStatus.Collected)
				.where('id', '=', input.id)
				.executeTakeFirst()
			if (!order) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `Manufacturing order with id ${input.id} not found`,
				})
			}
			if (
				order.finished_at &&
				Date.now() - order.finished_at.getTime() > 5 * Day
			) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Order finished a long time ago so it cannot be returned',
				})
			}
			await db
				.updateTable('pdo.orders')
				.set({
					finished_at: null,
					status: OrderStatus.Production,
				})
				.where('id', '=', input.id)
				.executeTakeFirstOrThrow()
		}),
	//
	finish: procedure
		.use(requireScope(Scope.pdo))
		.input(z.object({ id: z.number() }))
		.mutation(({ input, ctx }) =>
			db
				.transaction()
				.execute(async trx =>
					new Manufacturing(trx, ctx.user.id).finishOrder(input.id),
				),
		),
	//
	set_current_operation: procedure
		.use(requireScope(Scope.pdo))
		.input(
			z.object({
				id: z.number(),
				operation_index: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			await db
				.updateTable('pdo.orders')
				.set({
					current_operation: input.operation_index,
					current_operation_start_at: Date.now().toString(),
				})
				.where('id', '=', input.id)
				.execute()
		}),
})
