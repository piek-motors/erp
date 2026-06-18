import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import type { Job } from '#root/lib/jobs_runner.js'
import { addUTCMonths } from '#root/lib/time.js'
import { db } from '#root/sdk.js'

const OutdatedAttendanceMonths = 6

export class OutdatedAttendanceRemovalJob implements Job {
  interval(): number {
    return Day
  }

  async run() {
    const cutoffDate = addUTCMonths(new Date(), -OutdatedAttendanceMonths)

    const removedIntervals = await db
      .deleteFrom('hr.intervals')
      .where('ent', '<', cutoffDate)
      .returning('ent_event_id')
      .execute()

    const removedEvents = await db
      .deleteFrom('hr.events')
      .where('timestamp', '<', cutoffDate)
      .returning('id')
      .execute()

    logger.info(
      `Removed ${removedIntervals.length} outdated attendance intervals and ${removedEvents.length} outdated attendance events`,
    )
  }
}
