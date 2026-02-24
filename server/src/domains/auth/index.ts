import { db, procedure, router } from '#root/sdk.js'

export const auth = router({
  users: procedure.query(async () =>
    db
      .selectFrom('users')
      .select(['id', 'first_name', 'last_name', 'roles'])
      .where('is_deleted', '=', false)
      .execute(),
  ),
  read_notifications: procedure.mutation(async ({ ctx }) => {
    await db
      .updateTable('orders.notifications')
      .set({ seen: true })
      .where('user_id', '=', ctx.user.id)
      .execute()
  }),
})
