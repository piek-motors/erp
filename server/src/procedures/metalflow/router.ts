import { db, procedure } from '#root/deps.js'
import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete_file.rpc.js'
import { createDetail } from '#root/procedures/metalflow/detail/create.js'
import { deleteDetail } from '#root/procedures/metalflow/detail/delete.js'
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
import { sql } from 'kysely'
import z from 'zod'
import { getDetailShortInfo } from './detail/get_short.js'
import { getDetailInTheGroup } from './detail/grouping/get.js'
import { createDetailSupply } from './detail/supply.js'
import { createDetailWriteoff } from './detail/writeoff.js'
import { createManufacturingOrder } from './manufacturing/create.js'
import { deleteManufacturingOrder } from './manufacturing/delete.js'
import { finishManufacturing } from './manufacturing/finish.js'
import { getManufacturingOrder } from './manufacturing/get.js'
import { listManufacturing } from './manufacturing/list.js'
import { startMaterialPreparationPhase } from './manufacturing/start_material_preparation.js'
import { startProductionPhase } from './manufacturing/start_production.js'
import { updateManufacturing } from './manufacturing/update.js'
import { createMaterialSupply } from './material/supply.js'
import { writeoffMaterial } from './material/writeoff.js'
import { listOperations } from './operations/list.js'
import { revertOperation } from './operations/revert-operation.js'

export const metalFlowRouter = router({
  material: router({
    get: getMaterial,
    create: createMaterial,
    list: listMaterials,
    delete: deleteMaterial,
    update: updateMaterial,
    supply: createMaterialSupply,
    writeoff: writeoffMaterial
  }),
  details: router({
    get: getDetail,
    getShort: getDetailShortInfo,
    list: getDetailList,
    listByMaterialId: procedure
      .input(z.object({ material_id: z.number() }))
      .query(async ({ input }) =>
        db
          .selectFrom('metal_flow.details')
          .where(
            sql<boolean>`(automatic_writeoff->'material'->>'material_id')::int = ${input.material_id}`
          )
          .selectAll()
          .execute()
      ),
    delete: deleteDetail,
    update: updateDetail,
    create: createDetail,
    writeoff: createDetailWriteoff,
    supply: createDetailSupply
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
    get: getManufacturingOrder,
    create: createManufacturingOrder,
    update: updateManufacturing,
    delete: deleteManufacturingOrder,
    startMaterialPreparationPhase: startMaterialPreparationPhase,
    startProductionPhase: startProductionPhase,
    list: listManufacturing,
    finish: finishManufacturing
  }),
  deleteFile
})
