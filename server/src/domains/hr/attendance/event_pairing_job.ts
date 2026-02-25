import { runHiddenMarkovModel } from 'rust'
import { logger } from '#root/ioc/log.js'
import { type DB, db } from '#root/sdk.js'
import { HrRepo } from './hr.repo.js'

export class AttendanceEventPairing {
  private repository = new HrRepo()

  async run(events: DB.AttendanceEventsTable[]): Promise<void> {
    if (events.length === 0) return

    const hmm_input = events.map(e => ({
      ...e,
      timestamp: e.timestamp.toUTCString(),
    }))

    if (hmm_input.length === 0) {
      logger.info('No events eligible for processing')
      return
    }
    logger.info(`Processing ${hmm_input.length} events`)

    try {
      const modelResult = runHiddenMarkovModel(hmm_input)
      const intervals = await this.buildIntervals(modelResult)

      if (intervals.length === 0) {
        logger.info('No valid intervals to insert')
        return
      }
      const numInsertedOrUpdatedRows =
        await this.repository.upsert_intervals(intervals)
      logger.info(`Inserted or updated ${numInsertedOrUpdatedRows} intervals`)
    } catch (error) {
      logger.error(error, 'Hidden Markov model failed')
    }
  }

  private async getValidCards(): Promise<Set<string>> {
    const rows = await db
      .selectFrom('attendance.employees')
      .select('card')
      .execute()

    return new Set(rows.map(r => r.card))
  }

  private async buildIntervals(
    modelResult: ReturnType<typeof runHiddenMarkovModel>,
  ): Promise<DB.AttendanceIntervalTable[]> {
    const intervals: DB.AttendanceIntervalTable[] = []
    const validCards = await this.getValidCards()

    for (const employee of modelResult) {
      const card = employee.card
      if (!card || card === '0' || !validCards.has(card)) continue

      for (const shift of employee.shifts) {
        intervals.push({
          card,
          database: null,
          ent: new Date(shift.entry.datetime),
          ent_event_id: shift.entry.id,
          ext: shift.exit ? new Date(shift.exit.datetime) : null,
          ext_event_id: shift.exit?.id ?? null,
          updated_manually: null,
        })
      }
    }

    return intervals
  }
}
