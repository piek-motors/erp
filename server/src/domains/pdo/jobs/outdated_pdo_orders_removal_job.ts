import { ProductionOrderStatus } from 'models'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import type { Job } from '#root/lib/jobs_runner.js'
import { db } from '#root/sdk.js'

const OutdatedOrderDays = 7

export class OutdatedPdoOrdersRemovalJob implements Job {
  interval(): number {
    return Day
  }

  async run() {
    const cutoffDate = new Date(Date.now() - OutdatedOrderDays * Day)
    const result = await db
      .deleteFrom('pdo.orders')
      .where('created_at', '<', cutoffDate)
      .where('status', 'in', [ProductionOrderStatus.Waiting])
      .returning('id')
      .execute()

    logger.info(`Removed ${result.length} outdated orders`)
  }
}
