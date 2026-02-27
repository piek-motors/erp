import { z } from 'zod'
import type { DB } from 'db'
import { db, procedure, requireScope, router, Scope, sql } from '#root/sdk.js'

const ONE_MONTH_AGO = new Date()
ONE_MONTH_AGO.setMonth(ONE_MONTH_AGO.getMonth() - 1)

export const employees = router({
  list: procedure.query(async () => {
    return db
      .selectFrom('attendance.employees as e')
      .selectAll()
      .where(
        sql<boolean>`EXISTS (
        SELECT 1
        FROM attendance.events ev
        WHERE ev.card = e.card
          AND ev.timestamp >= ${ONE_MONTH_AGO}
      )`,
      )
      .orderBy(['e.lastname', 'e.firstname'])
      .execute()
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
      }),
    )
    .mutation(async ({ input }) => {
      const updateData: Partial<DB.AttendanceEmployeeTable> = {}
      if (input.job_title != null) {
        updateData.job_title = input.job_title
      }
      if (input.access_card != null) {
        updateData.access_card = input.access_card
      }

      const result = await db
        .updateTable('attendance.employees')
        .set(updateData)
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()

      if (result.numUpdatedRows === 0n) {
        throw new Error('Failed to update employee: not found')
      }

      return { success: true }
    }),
})
