import { db } from '#root/lib/db.js'
import { publicProcedure, router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete-file.rpc.js'
import { createDetailProcedure } from '#root/procedures/metalflow/detail/create.js'
import { deleteDetailProcedure } from '#root/procedures/metalflow/detail/delete.js'
import { deleteDetailMaterial } from '#root/procedures/metalflow/detail/delete_material.js'
import { getDetailProcedure } from '#root/procedures/metalflow/detail/get.js'
import { getDetailListProcedure } from '#root/procedures/metalflow/detail/list.js'
import { updateDetailProcedure } from '#root/procedures/metalflow/detail/update.js'
import { createMaterial } from '#root/procedures/metalflow/material/create.js'
import { deleteMaterial } from '#root/procedures/metalflow/material/delete.js'
import { getMaterial } from '#root/procedures/metalflow/material/get.js'
import { listMaterials } from '#root/procedures/metalflow/material/list.js'
import { updateMaterial } from '#root/procedures/metalflow/material/update.js'
import { addDetailIntoManufacturingList } from './procedures/metalflow/manufacturing/add.js'
import { finishManufacturing } from './procedures/metalflow/manufacturing/finish.js'
import { manufacturingList } from './procedures/metalflow/manufacturing/list.js'
import {
  createMaterialSupply,
  deleteSupply,
  listSupplies
} from './procedures/metalflow/material/supply.js'
import {
  deleteWriteoff,
  listWriteoff,
  writeoffThroughDetail,
  writeoffThroughMaterial
} from './procedures/metalflow/material/writeoff.js'

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
    writeoffTroughDetail: writeoffThroughDetail,
    deleteSupply: deleteSupply,
    deleteWriteoff: deleteWriteoff
  }),
  details: router({
    get: getDetailProcedure,
    list: getDetailListProcedure,
    delete: deleteDetailProcedure,
    update: updateDetailProcedure,
    create: createDetailProcedure,
    deleteDetailMaterial: deleteDetailMaterial
  }),
  manufacturing: router({
    list: manufacturingList,
    add: addDetailIntoManufacturingList,
    finish: finishManufacturing
  }),
  userList: publicProcedure.query(async () => {
    return await db
      .selectFrom('users')
      .select(['id', 'first_name', 'last_name', 'role'])
      .execute()
  }),
  deleteFile
})
