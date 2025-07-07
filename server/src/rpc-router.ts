import { db } from '#root/lib/db.js'
import { publicProcedure, router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete-file.rpc.js'
import { createDetailProcedure } from '#root/procedures/metalflow/detail/create.js'
import { deleteDetailProcedure } from '#root/procedures/metalflow/detail/delete.js'
import { deleteDetailMaterial } from '#root/procedures/metalflow/detail/delete_material.js'
import { getDetailProcedure } from '#root/procedures/metalflow/detail/get.js'
import { addDetailsToGroup } from '#root/procedures/metalflow/detail/grouping/add-details.js'
import { createDetailGroup } from '#root/procedures/metalflow/detail/grouping/create.js'
import { deleteDetailGroup } from '#root/procedures/metalflow/detail/grouping/delete.js'
import { listDetailGroups } from '#root/procedures/metalflow/detail/grouping/list.js'
import { removeDetailsFromGroup } from '#root/procedures/metalflow/detail/grouping/remove-details.js'
import { updateDetailGroup } from '#root/procedures/metalflow/detail/grouping/update.js'
import { getDetailListProcedure } from '#root/procedures/metalflow/detail/list.js'
import { updateDetailProcedure } from '#root/procedures/metalflow/detail/update.js'
import { createMaterial } from '#root/procedures/metalflow/material/create.js'
import { deleteMaterial } from '#root/procedures/metalflow/material/delete.js'
import { getMaterial } from '#root/procedures/metalflow/material/get.js'
import { listMaterials } from '#root/procedures/metalflow/material/list.js'
import { updateMaterial } from '#root/procedures/metalflow/material/update.js'
import { UserRole } from 'domain-model'
import z from 'zod'
import { getDetailInTheGroup } from './procedures/metalflow/detail/grouping/get.js'
import { addDetailIntoManufacturingList } from './procedures/metalflow/manufacturing/add.js'
import { finishManufacturing } from './procedures/metalflow/manufacturing/finish.js'
import { manufacturingList } from './procedures/metalflow/manufacturing/list.js'
import {
  createMaterialSupply,
  listSupplies
} from './procedures/metalflow/material/supply.js'
import {
  listWriteoff,
  writeoffThroughDetail,
  writeoffThroughMaterial
} from './procedures/metalflow/material/writeoff.js'
import { listOperations } from './procedures/metalflow/operations/list.js'
import { revertOperation } from './procedures/metalflow/operations/revert-operation.js'

export const rpcRouter = router({
  material: router({
    get: getMaterial,
    create: createMaterial,
    list: listMaterials,
    delete: deleteMaterial,
    update: updateMaterial,
    listSupply: listSupplies,
    supply: createMaterialSupply,
    listWriteoff: listWriteoff,
    writeoffTroughMaterial: writeoffThroughMaterial,
    writeoffTroughDetail: writeoffThroughDetail
  }),
  details: router({
    get: getDetailProcedure,
    list: getDetailListProcedure,
    delete: deleteDetailProcedure,
    update: updateDetailProcedure,
    create: createDetailProcedure,
    deleteDetailMaterial: deleteDetailMaterial
  }),
  detailGroups: router({
    get: getDetailInTheGroup,
    list: listDetailGroups,
    create: createDetailGroup,
    update: updateDetailGroup,
    delete: deleteDetailGroup,
    addDetails: addDetailsToGroup,
    removeDetails: removeDetailsFromGroup
  }),
  operations: router({
    list: listOperations,
    revert: revertOperation
  }),
  manufacturing: router({
    list: manufacturingList,
    add: addDetailIntoManufacturingList,
    finish: finishManufacturing
  }),
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

      if (input.role) {
        query = query.where('role', '=', input.role)
      }
      return await query.execute()
    }),
  deleteFile
})
