import { router } from '#root/lib/trpc/trpc.js'
import { createDetailProcedure } from '#root/procedures/metalflow/detail/create_detail.js'
import { deleteDetailProcedure } from '#root/procedures/metalflow/detail/delete_detail.js'
import { deleteDetailMaterial } from '#root/procedures/metalflow/detail/delete_detail_material.js'
import { getDetailProcedure } from '#root/procedures/metalflow/detail/get_detail.js'
import { getDetailListProcedure } from '#root/procedures/metalflow/detail/list_detail.js'
import { updateDetailProcedure } from '#root/procedures/metalflow/detail/update_detail.js'

export const detailRouter = router({
  get: getDetailProcedure,
  list: getDetailListProcedure,
  delete: deleteDetailProcedure,
  update: updateDetailProcedure,
  create: createDetailProcedure,
  deleteDetailMaterial: deleteDetailMaterial
})
