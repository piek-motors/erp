import { db } from '#root/ioc/db.js'
import { publicProcedure, router } from '#root/lib/trpc/trpc.js'
import { UserRole } from 'domain-model'
import z from 'zod'
import { attachmentRouter } from '../../procedures/attachment/router.js'
import { metalFlowRouter } from '../../procedures/metalflow/router.js'
import { ordersRouter } from '../../procedures/orders/router.js'

export const trpcRouter = router({
  orders: ordersRouter,
  metal: metalFlowRouter,
  attachments: attachmentRouter,
  userList: publicProcedure
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
    })
})
