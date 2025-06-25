import { router } from '#root/lib/trpc/trpc.js'
import { createMaterial } from '#root/procedures/metalflow/material/create_material.js'
import { deleteMaterial } from '#root/procedures/metalflow/material/delete_material.js'
import { getMaterial } from '#root/procedures/metalflow/material/get_material.js'
import { listMaterials } from '#root/procedures/metalflow/material/list_materials.js'
import { updateMaterial } from '#root/procedures/metalflow/material/update_material.js'
import {
  createMaterialSupply,
  deleteSupply,
  listSupplies
} from './supply_material.js'
import {
  deleteWriteoff,
  listWriteoff,
  writeoffThroughDetail,
  writeoffThroughMaterial
} from './writeoff_material.js'

export const materialRouter = router({
  get: getMaterial,
  create: createMaterial,
  list: listMaterials,
  delete: deleteMaterial,
  update: updateMaterial,
  listSupply: listSupplies,
  supply: createMaterialSupply,
  listWriteoff: listWriteoff,
  writeoffTroughMaterial: writeoffThroughMaterial,
  writeoffTroughDetail: writeoffThroughDetail,
  deleteSupply: deleteSupply,
  deleteWriteoff: deleteWriteoff
})
