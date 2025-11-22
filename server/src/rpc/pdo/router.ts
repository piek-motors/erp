import { db, procedure } from '#root/deps.js'
import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/rpc/attachment.js'
import { createDetail } from '#root/rpc/pdo/detail/create.js'
import { deleteDetail } from '#root/rpc/pdo/detail/delete.js'
import { getDetail } from '#root/rpc/pdo/detail/get.js'
import { getDetailList } from '#root/rpc/pdo/detail/list.js'
import { updateDetail } from '#root/rpc/pdo/detail/update.js'
import { assignDetailsToGroup } from '#root/rpc/pdo/detail_grouping/assign_details.js'
import { createDetailGroup } from '#root/rpc/pdo/detail_grouping/create.js'
import { deleteDetailGroup } from '#root/rpc/pdo/detail_grouping/delete.js'
import { listDetailGroups } from '#root/rpc/pdo/detail_grouping/list.js'
import { removeDetailsFromGroup } from '#root/rpc/pdo/detail_grouping/remove-details.js'
import { updateDetailGroup } from '#root/rpc/pdo/detail_grouping/update.js'
import { createMaterial } from '#root/rpc/pdo/material/create.js'
import { deleteMaterial } from '#root/rpc/pdo/material/delete.js'
import { getMaterial } from '#root/rpc/pdo/material/get.js'
import { listMaterials } from '#root/rpc/pdo/material/list.js'
import { updateMaterial } from '#root/rpc/pdo/material/update.js'
import { sql } from 'kysely'
import z from 'zod'
import { getDetailShortInfo } from './detail/get_short.js'
import { createDetailSupply } from './detail/supply.js'
import { createDetailWriteoff } from './detail/writeoff.js'
import { getDetailInTheGroup } from './detail_grouping/get.js'
import { setColorAnnotation } from './detail_grouping/set_color_annotation.js'
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
    writeoff: writeoffMaterial,
    getDistinctAlloys: procedure.query(async () =>
      db
        .selectFrom('pdo.materials')
        .select('alloy')
        .distinct()
        .execute()
        .then(res => res.map(e => e.alloy))
    )
  }),
  details: router({
    get: getDetail,
    getShort: getDetailShortInfo,
    list: getDetailList,
    listByMaterialId: procedure
      .input(z.object({ material_id: z.number() }))
      .query(async ({ input }) =>
        db
          .selectFrom('pdo.details')
          .where(
            sql<boolean>`(automatic_writeoff->'material'->>0)::int = ${input.material_id}`
          )
          .selectAll()
          .execute()
      ),
    delete: deleteDetail,
    update: updateDetail,
    create: createDetail,
    writeoff: createDetailWriteoff,
    supply: createDetailSupply,
    dict_processing_operations: procedure.query(async () => {
      const details = await db
        .selectFrom('pdo.details')
        .select(['processing_route'])
        .where('processing_route', 'is not', null)
        .execute()
      const operationsMap = new Map<string, number>()
      for (const detail of details) {
        const route = detail.processing_route
        if (route?.steps) {
          for (const step of route.steps) {
            const name = step.name.trim()
            if (name.length === 0) continue
            operationsMap.set(name, (operationsMap.get(name) ?? 0) + 1)
          }
        }
      }
      // Sort by frequency
      return Array.from(operationsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([op]) => op)
    })
  }),
  detail_groups: router({
    get: getDetailInTheGroup,
    list: listDetailGroups,
    create: createDetailGroup,
    update: updateDetailGroup,
    delete: deleteDetailGroup,
    add_details: assignDetailsToGroup,
    remove_details: removeDetailsFromGroup,
    set_сolor_annotation: setColorAnnotation
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
    finish: finishManufacturing,
    set_current_operation: procedure
      .input(
        z.object({
          id: z.number(),
          operation_index: z.number()
        })
      )
      .mutation(async ({ input }) => {
        await db
          .updateTable('pdo.manufacturing')
          .set({ current_operation: input.operation_index })
          .where('id', '=', input.id)
          .execute()
        return true
      })
  }),
  deleteFile
})
