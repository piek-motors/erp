import { procedure } from '#root/deps.js'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import {} from '#root/lib/trpc/trpc.js'
import { AttendanceReport } from '#root/service/attendance_report_generator.js'
import { z } from 'zod'

export const getAttendanceList = procedure
  .input(
    z.object({
      month: z.number().min(0).max(11),
      year: z.number().min(2010),
      timeRetentionMinutes: z.number().min(0),
      showFullInfo: z.boolean()
    })
  )
  .query(async ({ input }) => {
    const report = await attendanceReportGenerator.generateReport({
      period: {
        month: input.month,
        year: input.year
      },
      showFullInfo: input.showFullInfo
    })
    return report as AttendanceReport
  })
