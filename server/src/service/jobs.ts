import { db } from '#root/deps.js'
import { log } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { ManufacturingOrderStatus } from 'models'

const OutdatedManufacturingOrderDeletionAfter = 7 * Day

export class Jobs {
  initCron() {
    this.removeOutdatedManufacturingOrders()
    setInterval(() => {
      this.removeOutdatedManufacturingOrders()
    }, Day)
  }

  private async removeOutdatedManufacturingOrders() {
    const cutoffDate = new Date(
      Date.now() - OutdatedManufacturingOrderDeletionAfter
    )
    const result = await db
      .deleteFrom('pdo.manufacturing')
      .where('created_at', '<', cutoffDate)
      .where('status', 'in', [
        ManufacturingOrderStatus.Waiting,
        ManufacturingOrderStatus.Preparation
      ])
      .returning('id')
      .execute()
    log.debug(
      `Removed ${result.length} outdated orders created before ${cutoffDate}`
    )
  }
}
