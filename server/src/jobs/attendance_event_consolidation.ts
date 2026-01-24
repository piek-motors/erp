import { writeFileSync } from 'node:fs'
import { runHiddenMarkovModel } from 'rust'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { db } from '#root/sdk.js'
import type { Job } from './jobs_runner.js'

export class AttendanceEventConsolidation implements Job {
	async run(): Promise<void> {
		// TODO: remove where
		const events = await db
			.selectFrom('attendance.events')
			.selectAll()
			.where('card', '=', '10996559')
			.execute()
		logger.info(`Selected ${events.length} employess events for consolidation`)

		// persist test file
		writeFileSync('../rust/events_seed.json', JSON.stringify(events, null, 2))

		runHiddenMarkovModel(
			events.map(e => ({ ...e, timestamp: e.timestamp.toISOString() })),
		)
	}

	interval(): number {
		return Day
	}
}
