import type { MaterialStatDataContainer } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import {
	addUTCMonths,
	convertDateToUTC,
	startOfUTCMonth,
} from '#root/lib/time.js'
import { db } from '#root/sdk.js'
import { OperationType, WriteoffReason } from 'models'
import {
	MonthStrategy,
	PeriodAggregator,
	QuarterStrategy,
	TimeSeriesRollup,
	TimeWindow,
} from '../lib/statistic/period_aggregator.js'
import type { Job } from './jobs_runner.js'

export class MaterialSpendAggJob implements Job {
	constructor(
		private readonly material_stat_data_container: MaterialStatDataContainer,
	) {}

	interval(): number {
		return Day
	}

	async run(nMonths: number = 12) {
		const start = Date.now()

		const period_end = convertDateToUTC(new Date())
		const period_start = startOfUTCMonth(addUTCMonths(period_end, -nMonths))

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
				period_end,
			},
			`Materials quarter spendings quantification for ${operations.length} operations`,
		)

		const strategy = new MonthStrategy()
		const window = new TimeWindow(period_start, period_end, strategy)
		const writeoff_agg = new PeriodAggregator(window, strategy)

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
		this.material_stat_data_container.writeoffs.monthly = writeoff_agg

		{
			const rollap = new TimeSeriesRollup()
			const strategy = new QuarterStrategy()
			const window = new TimeWindow(period_start, period_end, strategy)
			const writeoff_agg_quarterly = new PeriodAggregator(window, strategy)

			for (const [id, bucket_series] of writeoff_agg.iterator) {
				writeoff_agg_quarterly.set(
					id,
					rollap.moth_to_quarter_aggregation(bucket_series),
				)
			}

			this.material_stat_data_container.writeoffs.quarterly =
				writeoff_agg_quarterly
		}

		const elapsedTimeSec = (Date.now() - start) / 1000
		logger.info(
			`Materials quarter spendings quantified in ${elapsedTimeSec} sec`,
		)
	}
}
