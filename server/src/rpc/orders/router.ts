import { db, procedure, z } from '#root/deps.js'
import { router } from '#root/lib/trpc/trpc.js'
import { OrderStatus } from 'models'
import { positionRouter } from './positions.js'

export const ordersRouter = router({
  positions: positionRouter,
  getByStatus: procedure
    .input(
      z.object({
        status: z.nativeEnum(OrderStatus)
      })
    )
    .query(async ({ input }) => {
      const orders = await db.selectFrom('orders.orders').selectAll().execute()
      return orders
    })
})
