import {
  type DB,
  db,
  procedure,
  router,
  type Selectable,
  z,
} from '#root/sdk.js'

export type OrderComment = Selectable<DB.OrderCommentsTable> & {
  first_name: string
  last_name: string
  user_id: number
}

export const comments = router({
  insert: procedure
    .input(
      z.object({
        order_id: z.number(),
        text: z.string(),
        user_id: z.number(),
      }),
    )
    .mutation(async ({ input }) =>
      db
        .insertInto('orders.comments')
        .values(input)
        .returning('id')
        .executeTakeFirstOrThrow(),
    ),
  //
  update: procedure
    .input(z.object({ id: z.number(), text: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .updateTable('orders.comments')
        .set({ text: input.text })
        .where('id', '=', input.id)
        .execute()
    }),
  //
  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .deleteFrom('orders.comments')
        .where('id', '=', input.id)
        .execute()
    }),
})
