import { db, procedure, router, z } from '#root/deps.js'

export const positionRouter = router({
  insert: procedure
    .input(
      z.object({
        order_id: z.number(),
        name: z.string(),
        description: z.string(),
        quantity: z.number().default(1)
      })
    )
    .mutation(async ({ input }) =>
      db
        .insertInto('orders.order_items')
        .values({
          order_id: input.order_id,
          name: input.name,
          description: input.description,
          quantity: input.quantity
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ),
  //
  update: procedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number(),
        name: z.string(),
        description: z.string()
      })
    )
    .mutation(async ({ input }) =>
      db
        .updateTable('orders.order_items')
        .set({
          name: input.name,
          description: input.description,
          quantity: input.quantity
        })
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    ),
  //
  delete: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ input }) =>
      db
        .deleteFrom('orders.order_items')
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    )
})
