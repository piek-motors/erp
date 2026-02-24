import { router } from '#root/lib/trpc/trpc.js'
import { attachments } from './attachment/attachment_rpc.js'
import { auth } from './auth/index.js'
import { hr } from './hr/index.js'
import { orders } from './orders/orders_rpc.js'
import { pdo } from './pdo/index.js'

export const trpcRouter = router({
  orders,
  pdo,
  attachments,
  hr,
  auth,
})
