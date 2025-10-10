import { db, procedure, router, z } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'

export type Mention = {
  id: number
  seen: boolean
  created_at: string
  text: string
  first_name: string
  last_name: string
  contractor: string | null
  city: string | null
  order_id: number
}

const mentionInput = z.object({
  order_id: z.number(),
  user_id: z.number(),
  comment_id: z.number()
})

export const mentionsRouter = router({
  list: procedure
    .input(z.object({ user_id: z.number() }))
    .query(async ({ input }) => {
      const q = db
        .selectFrom('orders.notifications as n')
        .selectAll()
        .innerJoin('orders.comments as c', 'c.id', 'n.comment_id')
        .innerJoin('users as u', 'u.id', 'c.user_id')
        .innerJoin('orders.orders as o', 'o.id', 'n.order_id')
        .select([
          'n.id',
          'n.seen',
          'c.created_at',
          'c.text',
          'u.first_name',
          'u.last_name',
          'o.contractor',
          'o.city',
          'o.id as order_id'
        ])
        .orderBy('n.id', 'desc')
        .where('n.user_id', '=', input.user_id)
      const [unseen, seen] = await Promise.all([
        q.where('n.seen', '=', false).execute(),
        q.where('n.seen', '=', true).limit(50).execute()
      ])
      return { unseen: matrixEncoder(unseen), seen: matrixEncoder(seen) }
    }),
  insert: procedure.input(mentionInput).mutation(async ({ input }) => {
    const mention = await db
      .insertInto('orders.notifications')
      .values({
        ...input,
        seen: false
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    return mention
  }),
  // mention checked,
  checked: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) =>
      db
        .updateTable('orders.notifications')
        .set({ seen: true })
        .where('id', '=', input.id)
        .returning('id')
        .executeTakeFirstOrThrow()
    ),
  //
  count: procedure
    .input(z.object({ user_id: z.number() }))
    .query(async ({ input }) => {
      const count = await db
        .selectFrom('orders.notifications')
        .where('user_id', '=', input.user_id)
        .where('seen', '=', false)
        .select(eb => eb.fn.countAll().as('count'))
        .executeTakeFirstOrThrow()
      return Number(count.count)
    })
})
