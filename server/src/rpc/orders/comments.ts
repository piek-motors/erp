import { db, procedure, router, z } from '#root/deps.js'
import { DB, Selectable } from 'db'

const comment = z.object({
  order_id: z.number(),
  text: z.string(),
  user_id: z.number()
})

export type CommentInput = z.infer<typeof comment>
export type OrderComment = Selectable<DB.OrderCommentsTable> & {
  first_name: string
  last_name: string
  user_id: number
}

export const commentsRouter = router({
  insert: procedure
    .input(comment)
    .mutation(async ({ input }) =>
      db
        .insertInto('orders.comments')
        .values(input)
        .returning('id')
        .executeTakeFirstOrThrow()
    ),
  //
  update: procedure
    .input(z.object({ id: z.number(), text: z.string() }))
    .mutation(async ({ input }) =>
      db
        .updateTable('orders.comments')
        .set({ text: input.text })
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    ),
  //
  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) =>
      db
        .deleteFrom('orders.comments')
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    )
})
