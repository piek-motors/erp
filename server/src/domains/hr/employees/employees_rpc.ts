import type { DB } from 'db'
import { z } from 'zod'
import { logger } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import { db, procedure, requireScope, router, Scope } from '#root/sdk.js'

const ONE_MONTH_AGO = new Date()
ONE_MONTH_AGO.setMonth(ONE_MONTH_AGO.getMonth() - 1)

/** Calculate days since a given timestamp. */
function daysSince(timestamp: Date): number {
  return Math.floor((Date.now() - timestamp.getTime()) / Day)
}

export const employees = router({
  list: procedure.query(async () => {
    const rows = await db
      .selectFrom('attendance.employees as e')
      .leftJoin('attendance.events as ev', 'ev.card', 'e.card')
      .selectAll('e')
      .select(eb => [eb.fn.max('ev.timestamp').as('last_event_timestamp')])
      .groupBy(['e.id'])
      .orderBy(['e.lastname', 'e.firstname'])
      .execute()

    return rows.map(row => ({
      ...row,
      days_since_last_event: row.last_event_timestamp
        ? daysSince(row.last_event_timestamp)
        : null,
    }))
  }),
  //
  get_job_titles: procedure.query(async () => {
    const result = await db
      .selectFrom('attendance.employees')
      .select('job_title')
      .where('job_title', 'is not', null)
      .where('job_title', '!=', '')
      .distinct()
      .orderBy('job_title')
      .execute()
    return result.map(r => r.job_title as string)
  }),
  //
  update_employee: procedure
    .use(requireScope(Scope.hr))
    .input(
      z.object({
        id: z.number(),
        job_title: z.string().nullish(),
        access_card: z.string().nullish(),
        firstname: z.string().nullish(),
        lastname: z.string().nullish(),
      }),
    )
    .mutation(async ({ input }) => {
      const prev = await db
        .selectFrom('attendance.employees')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()

      const updateData: Partial<DB.AttendanceEmployeeTable> = {}
      if (input.job_title != null) {
        updateData.job_title = input.job_title
      }
      if (input.access_card != null) {
        updateData.access_card = input.access_card
      }
      if (input.firstname != null) {
        updateData.firstname = input.firstname
      }
      if (input.lastname != null) {
        updateData.lastname = input.lastname
      }

      const result = await db
        .updateTable('attendance.employees')
        .set(updateData)
        .where('id', '=', input.id)
        .returningAll()
        .executeTakeFirstOrThrow()

      logger.info(
        { old: prev, new: result },
        `employee ${input.id} has been updated`,
      )
      return { success: true }
    }),
  //
  delete_employee: procedure
    .use(requireScope(Scope.hr))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const employee = await db
        .selectFrom('attendance.employees')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()

      await db
        .deleteFrom('attendance.employees')
        .where('id', '=', input.id)
        .execute()

      logger.info(
        { deleted: employee },
        `employee ${input.id} has been deleted`,
      )
      return { success: true }
    }),
})
