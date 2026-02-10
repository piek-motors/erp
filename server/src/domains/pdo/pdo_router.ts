import { router } from '#root/lib/trpc/trpc.js'
import { RpcError } from '#root/sdk.js'
import { create_dict_router } from '../../lib/create_dict_router.js'
import { delete_file } from '../attachment/attachment_rpc.js'
import { detail_groups } from './detail_groups_rpc.js'
import { details, get_details_by_operation_id } from './details_rpc.js'
import { material } from './materials_rpc.js'
import { operations } from './operations_rpc.js'
import { orders } from './orders_rpc.js'
import { orders_mut } from './orders_rpc_mut.js'

export const dict = router({
  operation_kinds: create_dict_router('pdo.dict_operation_kinds', async id => {
    const details = await get_details_by_operation_id(id)
    if (details.length) {
      throw new RpcError(
        'CONFLICT',
        `Некоторые детали ${details.map(e => e.id).join(' ')} зависят от этого значения`,
      )
    }
  }),
})

export const pdo = router({
  dict,
  material,
  details,
  detail_groups,
  operations,
  orders,
  orders_mut,
  delete_file,
})
