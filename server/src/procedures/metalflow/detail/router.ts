import { router } from '../../../lib/trpc/trpc.ts'
import { getDetailProcedure } from './get_detail.ts'
import { getDetailListProcedure } from './get_detail_list.ts'

export const detailRouter = router({
  get: getDetailProcedure,
  list: getDetailListProcedure
})
