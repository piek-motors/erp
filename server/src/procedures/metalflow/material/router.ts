import { router } from '../../../lib/trpc/trpc.ts'
import { createMaterial } from './create_material.ts'
import { deleteMaterial } from './delete_material.ts'
import { getMaterial } from './get_material.ts'
import { listMaterials } from './list_materials.ts'
import { updateMaterial } from './update_material.ts'

export const materialRouter = router({
  get: getMaterial,
  create: createMaterial,
  list: listMaterials,
  delete: deleteMaterial,
  update: updateMaterial
})
