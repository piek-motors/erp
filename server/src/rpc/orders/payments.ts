import { db, procedure, router, z } from '#root/deps.js'
import { DB, Selectable } from 'db'

const payment = z.object({
  order_id: z.number(),
  amount: z.number(),
  date: z.number()
})

export type PaymentPayload = z.infer<typeof payment>
export type Payment = Selectable<DB.OrderPaymentsTable>

export const paymentsRouter = router({
  insert: procedure.input(payment).mutation(async ({ input }) =>
    db
      .insertInto('orders.order_payments')
      .values({
        ...input,
        date: new Date(input.date)
      })
      .returning('id')
      .executeTakeFirstOrThrow()
  ),
  //
  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) =>
      db
        .deleteFrom('orders.order_payments')
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    )
})
