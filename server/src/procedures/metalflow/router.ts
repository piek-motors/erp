import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete-file.rpc.js'
import { createDetailProcedure } from '#root/procedures/metalflow/detail/create.js'
import { deleteDetailProcedure } from '#root/procedures/metalflow/detail/delete.js'
import { deleteDetailMaterial } from '#root/procedures/metalflow/detail/delete_material.js'
import { getDetailProcedure } from '#root/procedures/metalflow/detail/get.js'
import { assignDetailsToGroup } from '#root/procedures/metalflow/detail/grouping/assign_details.js'
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
import { getDetailInTheGroup } from './detail/grouping/get.js'
import { addDetailIntoManufacturingList } from './manufacturing/add.js'
import { finishManufacturing } from './manufacturing/finish.js'
import { manufacturingList } from './manufacturing/list.js'
import { createMaterialSupply, listSupplies } from './material/supply.js'
import {
  listWriteoff,
  writeoffThroughDetail,
  writeoffThroughMaterial
} from './material/writeoff.js'
import { listOperations } from './operations/list.js'
import { revertOperation } from './operations/revert-operation.js'

export const metalFlowRouter = router({
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
    addDetails: assignDetailsToGroup,
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
  deleteFile
})
