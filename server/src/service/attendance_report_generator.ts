import { timedeltaInSeconds } from '#root/lib/time.js'
import { KDB } from 'db'

interface Period {
  month: number
  year: number
}

interface GeneratorOptions {
  period: Period
  showFullInfo: boolean
}

interface Interval {
  ent?: Date | null
  ext?: Date | null
  dur: number
}
export interface AttendanceEmployee {
  id: number
  name: string
  card: string
  total: number
  workDays: number
  totalIntervalsCount: number
  days: {
    [day: number]: { intervals: Interval[]; total_dur: number }
  }
}

export interface AttendanceReport {
  daysInMonth: number
  employees: AttendanceEmployee[]
}

export class AttendanceReportGenerator {
  constructor(private readonly db: KDB) {}

  async generateReport(options: GeneratorOptions): Promise<AttendanceReport> {
    const { period, showFullInfo } = options
    const startDate = new Date(
      Date.UTC(Number(period.year), Number(period.month), 1, 0, 0, 0)
    )
    const endDate = new Date(
      Date.UTC(Number(period.year), Number(period.month) + 1, 1, 0, 0, 0)
    )
    const [intervals, users] = await Promise.all([
      this.db
        .selectFrom('attendance.intervals')
        .selectAll()
        .where('ent', '>=', startDate)
        .where('ent', '<', endDate)
        .execute(),
      this.db.selectFrom('attendance.users').selectAll().execute()
    ])

    const days = createDaysInMonthArray(period)
    const result: AttendanceEmployee[] = []

    for (const user of users) {
      const userRelatedIntervals = intervals.filter(
        interval => interval.card === user.card
      )
      if (!userRelatedIntervals.length) continue

      const daysMap = days.reduce((acc, day) => {
        acc[day] = {
          intervals: [],
          total_dur: 0
        }
        return acc
      }, {} as Record<number, { intervals: Interval[]; total_dur: number }>)

      const employee: AttendanceEmployee = {
        totalIntervalsCount: userRelatedIntervals.length,
        id: user.id,
        name: `${user.lastname} ${user.firstname}`,
        card: user.card,
        total: 0,
        workDays: 0,
        days: daysMap
      }

      for (const interval of userRelatedIntervals) {
        const i: Interval = {
          dur: 0
        }
        if (interval.ext && interval.ent) {
          const interval_dur = timedeltaInSeconds(interval.ent, interval.ext)
          i.dur = interval_dur
        }

        if (showFullInfo) {
          i.ent = interval.ent
          i.ext = interval.ext
        }

        const dayInMonth = new Date(interval.ent).getDate()
        daysMap[dayInMonth].intervals.push(i)
        daysMap[dayInMonth].total_dur += i.dur
      }

      employee.total = Object.values(employee.days).reduce(
        (acc, day) => acc + day.total_dur,
        0
      )

      for (const day of Object.values(employee.days)) {
        if (day.total_dur > 0) {
          employee.workDays += 1
        }
      }

      result.push(employee)
    }

    result.sort((a, b) => a.name.localeCompare(b.name))
    return { employees: result, daysInMonth: days.length }
  }
}

function createDaysInMonthArray(period: Period) {
  const { month, year } = period
  const days_number = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days_number }, (_, k) => k + 1)
}
