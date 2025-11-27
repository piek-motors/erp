import { db, procedure } from '#root/deps.js'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import {} from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getReport = procedure
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
  )

export const updateInterval = procedure
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
  })
