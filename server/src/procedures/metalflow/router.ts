import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete_file.rpc.js'
import { createDetail } from '#root/procedures/metalflow/detail/create.js'
import { deleteDetail } from '#root/procedures/metalflow/detail/delete.js'
import { deleteDetailMaterial } from '#root/procedures/metalflow/detail/delete_material.js'
import { getDetail } from '#root/procedures/metalflow/detail/get.js'
import { assignDetailsToGroup } from '#root/procedures/metalflow/detail/grouping/assign_details.js'
import { createDetailGroup } from '#root/procedures/metalflow/detail/grouping/create.js'
import { deleteDetailGroup } from '#root/procedures/metalflow/detail/grouping/delete.js'
import { listDetailGroups } from '#root/procedures/metalflow/detail/grouping/list.js'
import { removeDetailsFromGroup } from '#root/procedures/metalflow/detail/grouping/remove-details.js'
import { updateDetailGroup } from '#root/procedures/metalflow/detail/grouping/update.js'
import { getDetailList } from '#root/procedures/metalflow/detail/list.js'
import { updateDetail } from '#root/procedures/metalflow/detail/update.js'
import { createMaterial } from '#root/procedures/metalflow/material/create.js'
import { deleteMaterial } from '#root/procedures/metalflow/material/delete.js'
import { getMaterial } from '#root/procedures/metalflow/material/get.js'
import { listMaterials } from '#root/procedures/metalflow/material/list.js'
import { updateMaterial } from '#root/procedures/metalflow/material/update.js'
import { getDetailInTheGroup } from './detail/grouping/get.js'
import { listDetailsByMaterialId } from './detail/list_by_material_id.js'
import { finishManufacturing } from './manufacturing/finish.js'
import { listManufacturing } from './manufacturing/list.js'
import { startManufacturing } from './manufacturing/start.js'
import { createMaterialSupply, listSupplies } from './material/supply.js'
import { listWriteoff, writeoffThroughMaterial } from './material/writeoff.js'
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
    writeoffTroughMaterial: writeoffThroughMaterial
  }),
  details: router({
    get: getDetail,
    list: getDetailList,
    listByMaterialId: listDetailsByMaterialId,
    delete: deleteDetail,
    update: updateDetail,
    create: createDetail,
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
    list: listManufacturing,
    start: startManufacturing,
    finish: finishManufacturing
  }),
  deleteFile
})
