import {
	type DB,
	db,
	procedure,
	requireScope,
	router,
	Scope,
	type Selectable,
	z,
} from '#root/sdk.js'

export type Payment = Selectable<DB.OrderPaymentsTable>

export const payments = router({
	insert: procedure
		.use(requireScope(Scope.orders))
		.input(
			z.object({
				order_id: z.number(),
				amount: z.number(),
				date: z.number(),
			}),
		)
		.mutation(async ({ input }) =>
			db
				.insertInto('orders.order_payments')
				.values({
					...input,
					date: new Date(input.date),
				})
				.returning('id')
				.executeTakeFirstOrThrow(),
		),
	//
	delete: procedure
		.use(requireScope(Scope.orders))
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			await db
				.deleteFrom('orders.order_payments')
				.where('id', '=', input.id)
				.returning('id')
				.executeTakeFirstOrThrow()
		}),
})
