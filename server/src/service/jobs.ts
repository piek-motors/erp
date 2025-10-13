import { db } from '#root/deps.js'
import { log } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { EnManufacturingOrderStatus } from 'models'

const OutdatedOrderDays = 14

export class Jobs {
  initCron() {
    this.removeOutdatedManufacturingOrders()
    setInterval(() => {
      this.removeOutdatedManufacturingOrders()
    }, Day)
  }

  private async removeOutdatedManufacturingOrders() {
    const cutoffDate = new Date(Date.now() - OutdatedOrderDays * Day)
    const result = await db
      .deleteFrom('metal_flow.manufacturing')
      .where('created_at', '<', cutoffDate)
      .where('status', 'in', [
        EnManufacturingOrderStatus.Waiting,
        EnManufacturingOrderStatus.MaterialPreparation
      ])
      .returning('id')
      .execute()
    log.info(
      `Removed ${result.length} outdated orders created before ${cutoffDate}`
    )
  }
}
