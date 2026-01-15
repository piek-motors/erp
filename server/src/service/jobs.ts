import { db } from '#root/deps.js'
import { MaterialStatDataContainer } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { ManufacturingOrderStatus, OperationType, WriteoffReason } from 'models'
import {
  MonthFrequencer,
  PeriodAggregator,
  PeriodAggregatorArgs
} from './period_aggregator.js'

const OutdatedManufacturingOrderDeletionAfter = 7 * Day

export class Jobs {
  constructor(
    private readonly material_stat_data_container: MaterialStatDataContainer
  ) {}

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

  private async calcMaterialQuarterlySpendings(nMonths: number = 12) {
    const start = Date.now()

    const period_end = new Date()
    const period_start = new Date()
    period_start.setMonth(period_end.getMonth() - 12)

    const operations = await db
      .selectFrom('pdo.operations as op')
      .selectAll()
      .where('material_id', 'is not', null)
      .where('op.timestamp', '>', period_start)
      .where('op.timestamp', '<', period_end)
      .execute()

    logger.info(
      {
        period_start,
        period_end
      },
      `Materials quarter spendings quantification for ${operations.length} operations`
    )

    const bucket_args: PeriodAggregatorArgs = {
      frequencer: new MonthFrequencer(),
      period_start,
      period_end
    }
    const writeoff_agg = new PeriodAggregator(bucket_args)

    for (const op of operations) {
      if (!op.material_id)
        throw new Error('operation is not related to material')

      const is_writeoff =
        op.operation_type == OperationType.Writeoff &&
        op.reason == WriteoffReason.UsedInProduction

      if (is_writeoff) {
        writeoff_agg.add(op.material_id, op.timestamp, Number(op.qty))
      }
    }

    this.material_stat_data_container.writeoffs = writeoff_agg

    const elapsedTimeSec = (Date.now() - start) / 1000
    logger.info(
      `Materials quarter spendings quantified in ${elapsedTimeSec} sec`
    )
  }
}
