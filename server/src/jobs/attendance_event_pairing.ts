import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { db } from '#root/sdk.js'
import { runHiddenMarkovModel } from 'rust'
import type { Job } from './jobs_runner.js'

export class AttendanceEventPairingJob implements Job {
	async run(): Promise<void> {
		// TODO: remove where
		const events = await db
			.selectFrom('attendance.events')
			.selectAll()
			.where('card', '=', '10996559')
			.execute()
		logger.info(`Selected ${events.length} employess events for consolidation`)

		try {
			const empl_intervals = runHiddenMarkovModel(
				events.map(e => ({ ...e, timestamp: e.timestamp.toUTCString() })),
			)

			// logger.info(empl_intervals, 'result')
		} catch (error) {
			logger.error(error, 'Hidden markov model failed')
		}
	}

	interval(): number {
		return Day
	}
}
