import { DB, db } from '#root/deps.js'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import {
  ManufacturingOrderStatus,
  OperationType,
  SupplyReason,
  WriteoffReason
} from 'models'

const OutdatedManufacturingOrderDeletionAfter = 7 * Day

export class Jobs {
  initCron() {
    this.removeOutdatedManufacturingOrders()
    this.calcMaterialQuarterlySpendings()
    setInterval(() => {
      this.removeOutdatedManufacturingOrders()
      this.calcMaterialQuarterlySpendings()
    }, Day)
  }

  private async removeOutdatedManufacturingOrders() {
    const cutoffDate = new Date(
      Date.now() - OutdatedManufacturingOrderDeletionAfter
    )
    const result = await db
      .deleteFrom('pdo.orders')
      .where('created_at', '<', cutoffDate)
      .where('status', 'in', [
        ManufacturingOrderStatus.Waiting,
        ManufacturingOrderStatus.Preparation
      ])
      .returning('id')
      .execute()
    logger.debug(
      `Removed ${result.length} outdated orders created before ${cutoffDate}`
    )
  }

  private async calcMaterialQuarterlySpendings() {
    const end = new Date()
    const start = new Date()
    start.setMonth(end.getMonth() - 3)

    const operations = await db
      .selectFrom('pdo.operations')
      .selectAll()
      .where('material_id', 'is not', null)
      .where('pdo.operations.timestamp', '>', start)
      .execute()

    type MapVal = { income: number; outcome: number }
    const map: Map<number, MapVal> = new Map()
    // initialize map
    for (const op of operations) {
      if (!op.material_id) {
        throw new Error('operation is not related to material')
      }
      const material = map.get(op.material_id)
      if (!material) {
        map.set(op.material_id, { income: 0, outcome: 0 })
      }
    }
    // calc totals
    for (const op of operations) {
      if (!op.material_id) {
        throw new Error('operation is not related to material')
      }
      if (!op.qty) {
        throw Error('qty is not specified')
      }
      const totals = map.get(op.material_id)
      if (!totals) {
        throw Error('map is not initialized properly')
      }

      if (
        op.operation_type == OperationType.Supply &&
        op.reason == SupplyReason.FromSupplier
      ) {
        totals.income += Number(op.qty)
      }

      if (
        op.operation_type == OperationType.Writeoff &&
        op.reason == WriteoffReason.UsedInProduction
      ) {
        totals.outcome += Number(op.qty)
      }
    }

    const entities: DB.MaterialQuarterlySpendingTable[] = []
    map.forEach((value, material_id) => {
      entities.push({
        material_id,
        total_income: Math.round(value.income),
        total_outcome: Math.round(value.outcome)
      })
    })

    await db
      .insertInto('pdo.materials_quarterly_spending')
      .values(entities)
      .onConflict(oc =>
        oc.column('material_id').doUpdateSet(eb => ({
          material_id: eb.ref('excluded.material_id'),
          total_income: eb.ref('excluded.total_income'),
          total_outcome: eb.ref('excluded.total_outcome')
        }))
      )
      .execute()
  }
}
