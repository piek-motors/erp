import { procedure } from '#root/deps.js'
import { db } from '#root/ioc/db.js'
import { router } from '#root/lib/trpc/trpc.js'
import { UserRole } from 'domain-model'
import z from 'zod'
import { attachmentRouter } from './attachment/router.js'
import { attendanceRouter } from './attendance/router.js'
import { metalFlowRouter } from './metalflow/router.js'
import { ordersRouter } from './orders/router.js'

export const trpcRouter = router({
  orders: ordersRouter,
  metal: metalFlowRouter,
  attachments: attachmentRouter,
  attendance: attendanceRouter,
  userList: procedure
    .input(
      z.object({
        role: z.nativeEnum(UserRole).optional()
      })
    )
    .query(async ({ input }) => {
      let query = db
        .selectFrom('users')
        .select(['id', 'first_name', 'last_name', 'role'])
        .where('is_deleted', '=', false)

      if (input.role) {
        query = query.where('role', '=', input.role)
      }
      return await query.execute()
    }),
  markAllNotificationsAsRead: procedure
    .input(
      z.object({
        userId: z.number()
      })
    )
    .mutation(async ({ input }) => {
      await db
        .updateTable('orders.notifications')
        .set({ seen: true })
        .where('user_id', '=', input.userId)
        .execute()
      return true
    })
})
