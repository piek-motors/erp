import { db, procedure, requireScope, Scope } from '#root/deps.js'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import { router } from '#root/lib/trpc/trpc.js'
import { AbsenceReason } from 'models'
import { z } from 'zod'

export const attendance = router({
  get_report: procedure
    .input(
      z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(2010),
        timeRetentionMinutes: z.number().min(0),
        showFullInfo: z.boolean()
      })
    )
    .query(async ({ input }) =>
      attendanceReportGenerator.generateReport({
        period: {
          month: input.month,
          year: input.year
        },
        showFullInfo: input.showFullInfo,
        timeRetentionMinutes: input.timeRetentionMinutes
      })
    ),
  //
  update_interval: procedure
    .use(requireScope(Scope.staff))
    .input(
      z.object({
        ent_event_id: z.number(),
        ent: z.string(),
        ext: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const interval = await db
        .updateTable('attendance.intervals')
        .set({
          ent: new Date(input.ent),
          ext: new Date(input.ext)
        })
        .where('ent_event_id', '=', input.ent_event_id)
        .execute()
      return interval.length
    }),
  //
  set_absence_reason: procedure
    .use(requireScope(Scope.staff))
    .input(
      z.object({
        user_id: z.number(),
        date: z.string(),
        reason: z.enum(AbsenceReason)
      })
    )
    .mutation(async ({ input }) => {
      await db
        .insertInto('attendance.employee_absences')
        .values(input)
        .execute()
    })
})
