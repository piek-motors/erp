import { router } from '#root/lib/trpc/trpc.js'
import { create_dict_router } from '../../lib/create_dict_router.js'
import { delete_file } from '../attachment.js'
import { detail_groups } from './detail_groups.js'
import { details } from './details.js'
import { material } from './materials.js'
import { operations } from './operations.js'
import { orders } from './orders.js'

export const dict = router({
  operation_kinds: create_dict_router('pdo.dict_operation_kinds')
})

export const pdo = router({
  dict,
  material,
  details,
  detail_groups,
  operations,
  orders,
  delete_file
})
