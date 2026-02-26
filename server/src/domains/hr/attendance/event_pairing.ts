import { runHiddenMarkovModel } from 'rust'
import { logger } from '#root/ioc/log.js'
import { type DB } from '#root/sdk.js'
import { HrRepo } from './hr.repo.js'

export class AttendanceEventPairing {
  private repository = new HrRepo()

  async run(
    events: Array<DB.AttendanceEventsTable & { employee_id: number }>,
  ): Promise<void> {
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

  private async buildIntervals(
    modelResult: ReturnType<typeof runHiddenMarkovModel>,
  ): Promise<DB.AttendanceIntervalTable[]> {
    const intervals: DB.AttendanceIntervalTable[] = []
    const employee_id_index =
      await this.repository.employees_employee_id_index()
    for (const employee of modelResult) {
      const card = employee_id_index.get(employee.employee_id)
      if (!employee.employee_id || employee.employee_id === 0 || !card) continue

      for (const shift of employee.shifts) {
        intervals.push({
          database: null,
          card,
          ent: new Date(shift.entry.datetime),
          ent_event_id: shift.entry.id,
          employee_id: employee.employee_id,
          ext: shift.exit ? new Date(shift.exit.datetime) : null,
          ext_event_id: shift.exit?.id ?? null,
          updated_manually: null,
        })
      }
    }

    return intervals
  }
}
