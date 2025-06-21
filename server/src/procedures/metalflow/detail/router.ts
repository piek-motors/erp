import { router } from '../../../lib/trpc/trpc.ts'
import { createDetailProcedure } from './create_detail.ts'
import { deleteDetailProcedure } from './delete_detail.ts'
import { deleteDetailMaterial } from './delete_detail_material.ts'
import { getDetailProcedure } from './get_detail.ts'
import { getDetailListProcedure } from './list_detail.ts'
import { updateDetailProcedure } from './update_detail.ts'

export const detailRouter = router({
  get: getDetailProcedure,
  list: getDetailListProcedure,
  delete: deleteDetailProcedure,
  update: updateDetailProcedure,
  create: createDetailProcedure,
  deleteDetailMaterial: deleteDetailMaterial
})
