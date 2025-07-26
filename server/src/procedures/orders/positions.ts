import { db, procedure, router, z } from '#root/deps.js'

export const positionRouter = router({
  list: procedure
    .input(
      z.object({
        order_id: z.number()
      })
    )
    .query(async ({ input }) => {
      const positions = await db
        .selectFrom('orders.order_items')
        .selectAll()
        .where('order_id', '=', input.order_id)
        .orderBy('id', 'asc')
        .execute()

      return positions
    }),

  insert: procedure
    .input(
      z.object({
        order_id: z.number(),
        name: z.string(),
        description: z.string(),
        quantity: z.number().default(1)
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .insertInto('orders.order_items')
        .values({
          order_id: input.order_id,
          name: input.name,
          description: input.description,
          quantity: input.quantity
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return result
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number(),
        name: z.string(),
        description: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .updateTable('orders.order_items')
        .set({
          name: input.name,
          description: input.description,
          quantity: input.quantity
        })
        .where('id', '=', input.id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return result
    }),

  delete: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .deleteFrom('orders.order_items')
        .where('id', '=', input.id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return result
    })
})
