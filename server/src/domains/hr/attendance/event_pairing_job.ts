import { runHiddenMarkovModel } from 'rust'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import type { Job } from '#root/lib/jobs_runner.js'
import { type DB, db } from '#root/sdk.js'

export class AttendanceEventPairingJob implements Job {
  async run(): Promise<void> {
    const cutoff_date = new Date(Date.now() - 60 * Day)

    if (process.env.NODE_ENV != 'development') {
      return
    }

    const events = await db
      .selectFrom('attendance.events')
      .selectAll()
      .where('timestamp', '>', cutoff_date)
      .execute()

    logger.info(`Selected ${events.length} employess events for consolidation`)

    try {
      const empl_intervals = runHiddenMarkovModel(
        events.map(e => ({ ...e, timestamp: e.timestamp.toUTCString() })),
      )

      const valid_cards = new Set(
        (
          await db.selectFrom('attendance.employees').select('card').execute()
        ).map(e => e.card),
      )

      await db.deleteFrom('attendance.intervals').execute()

      const res = await db
        .insertInto('attendance.intervals')
        .values(
          empl_intervals.flatMap(each => {
            const card = each.card
            if (!card || card == '0' || !valid_cards.has(card)) return []
            return each.shifts.map(
              s =>
                ({
                  card,
                  database: '',
                  ent: new Date(s.entry.datetime),
                  ent_event_id: s.entry.id,
                  ext: s.exit ? new Date(s.exit.datetime) : null,
                  ext_event_id: s.exit?.id ?? null,
                  updated_manually: null,
                }) satisfies DB.AttendanceIntervalTable,
            )
          }),
        )
        .onConflict(oc => oc.doNothing())
        .executeTakeFirst()

      logger.info(`Inserted ${res.numInsertedOrUpdatedRows} intervals`)
    } catch (error) {
      logger.error(error, 'Hidden markov model failed')
    }
  }

  interval(): number {
    return Day
  }
}
