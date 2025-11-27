import { procedure } from '#root/deps.js'
import { db } from '#root/ioc/db.js'
import { router } from '#root/lib/trpc/trpc.js'
import { UserRole } from 'models'
import z from 'zod'
import {
  deleteFile,
  getAttachmentByKey,
  getDetailAttachments,
  updateName
} from './attachment.js'
import { getReport, updateInterval } from './attendance.js'
import { ordersRouter } from './orders/router.js'
import { metalFlowRouter as pdoRouter } from './pdo/router.js'

export const trpcRouter = router({
  orders: ordersRouter,
  pdo: pdoRouter,
  attachments: router({
    updateName,
    deleteFile,
    getDetailAttachments,
    getAttachmentByKey
  }),
  attendance: router({
    get_report: getReport,
    update_interval: updateInterval
  }),
  userList: procedure
    .input(
      z.object({
        role: z.enum(UserRole).optional()
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
