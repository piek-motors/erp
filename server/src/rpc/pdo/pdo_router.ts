import { router } from '#root/lib/trpc/trpc.js'
import { delete_file } from '../attachment.js'
import { detail_groups } from './detail_groups.js'
import { details } from './details.js'
import { material } from './materials.js'
import { operations } from './operations.js'
import { orders } from './orders.js'

export const pdo = router({
  material,
  details,
  detail_groups,
  operations,
  manufacturing: orders,
  delete_file
})
