import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { Job } from '#root/lib/jobs_runner.js'
import { db } from '#root/sdk.js'
import { runHiddenMarkovModel } from 'rust'

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

      // empl_intervals.forEach(empl => {
      // 	logger.info(`Intervals for employee ${empl.card}:`)
      // 	empl.shifts.forEach(interval => {
      // 		logger.info(
      // 			`${[interval.entry.datetime.slice(0, 16), interval.exit?.datetime.slice(0, 16)].join(' - ')}`,
      // 		)
      // 	})
      // })
    } catch (error) {
      logger.error(error, 'Hidden markov model failed')
    }
  }

  interval(): number {
    return Day
  }
}
