import { ManufacturingOrderStatus } from 'models'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import type { Job } from '#root/lib/jobs_runner.js'
import { db } from '#root/sdk.js'

const OutdatedManufacturingOrderDeletionAfter = 7 * Day

export class OutdatedPdoOrdersRemovalJob implements Job {
  interval(): number {
    return Day
  }

  async run() {
    const cutoffDate = new Date(
      Date.now() - OutdatedManufacturingOrderDeletionAfter,
    )
    const result = await db
      .deleteFrom('pdo.orders')
      .where('created_at', '<', cutoffDate)
      .where('status', 'in', [
        ManufacturingOrderStatus.Waiting,
        ManufacturingOrderStatus.Preparation,
      ])
      .returning('id')
      .execute()
    logger.debug(
      `Removed ${result.length} outdated orders created before ${cutoffDate}`,
    )
  }
}
