import { Hour, Minute } from '#root/lib/constants.js'
import { timedeltaInSeconds } from '#root/lib/time.js'
import { KDB } from 'db'

interface Period {
  month: number
  year: number
}

interface GeneratorOptions {
  period: Period
  showFullInfo: boolean
  timeRetentionMinutes: number
}

export interface Interval {
  ent?: Date | null
  ext?: Date | null
  dur: number
  ent_event_id: number
}

export interface Employee {
  id: number
  name: string
  card: string
  total: number
  workDays: number
  totalIntervalsCount: number
  days: {
    [day: number]: { intervals: Interval[]; total_dur: number; broken: boolean }
  }
}

export interface AttendanceReport {
  daysInMonth: number
  employees: Employee[]
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
    const result: Employee[] = []
    const dailyTimeRetention = options.timeRetentionMinutes * 60

    for (const user of users) {
      const userRelatedIntervals = intervals.filter(
        interval => interval.card === user.card
      )
      if (!userRelatedIntervals.length) continue

      const daysMap = days.reduce((acc, day) => {
        acc[day] = {
          intervals: [],
          total_dur: 0,
          broken: false
        }
        return acc
      }, {} as Record<number, { intervals: Interval[]; total_dur: number; broken: boolean }>)

      const employee: Employee = {
        totalIntervalsCount: userRelatedIntervals.length,
        id: user.id,
        name: removeCardNumber(`${user.lastname} ${user.firstname}`),
        card: user.card,
        total: 0,
        workDays: 0,
        days: daysMap
      }

      for (const interval of userRelatedIntervals) {
        const i: Interval = {
          ent_event_id: interval.ent_event_id,
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

        const dayOfMonth = new Date(interval.ent).getDate()
        daysMap[dayOfMonth].intervals.push(i)
        if (i.dur) {
          daysMap[dayOfMonth].total_dur += i.dur - dailyTimeRetention
        }
      }

      // fake overtime correction
      // if employee worked more then 8:00 hours, but less then 8:54 hours, we should round it as 8:00 hours
      const RoundingStartRange = (8 * Hour) / 1000
      const RoundingEndRange = (8 * Hour + 54 * Minute) / 1000
      const corrected = Object.values(employee.days).map(day => {
        if (
          day.total_dur > RoundingStartRange &&
          day.total_dur <= RoundingEndRange
        ) {
          day.total_dur = RoundingStartRange
        }
        return day
      })

      employee.total = Object.values(corrected).reduce(
        (acc, day) => acc + day.total_dur,
        0
      )

      for (const day of Object.values(employee.days)) {
        if (day.total_dur < 0) {
          day.total_dur = 0
        }
        if (day.total_dur > 0) {
          employee.workDays += 1
        }
        if (day.intervals.length === 1 && !day.total_dur) {
          day.broken = true
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

const removeCardNumber = (employeeName: string) => {
  return employeeName.replace(/\d+/g, '').replace(/\s+/g, ' ').trim()
}
