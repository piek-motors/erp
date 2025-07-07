import { db } from '#root/lib/db.js'
import { publicProcedure, router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete-file.rpc.js'
import { UserRole } from 'domain-model'
import z from 'zod'
import { metalFlowRouter } from './procedures/metalflow/router.js'
import { ordersRouter } from './procedures/orders/router.js'

export const rpcRouter = router({
  orders: ordersRouter,
  metal: metalFlowRouter,
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
    }),
  deleteFile
})
