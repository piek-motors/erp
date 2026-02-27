import { rpc } from '@/lib/rpc/rpc.client'
import type { AttendanceReport } from '@/server/domains/hr/attendance/report_generator'
import { makeAutoObservable, runInAction } from 'mobx'
import { СonfiguratorVM } from '../configurator'

export class Report {
  constructor(
    readonly resp: AttendanceReport,
    readonly month: string,
    readonly timeRetention: number,
    readonly isFull: boolean,
  ) {}
}

class AttendanceReportVM {
  config = new СonfiguratorVM()
  report: Report | null = null
  loading = true

  constructor() {
    makeAutoObservable(this)
  }

  async load_from_query_params(search: string) {
    this.loading = true
    try {
      const params = new URLSearchParams(search)
      const month = parseInt(params.get('month') || '0', 10)
      const year = parseInt(params.get('year') || '2024', 10)
      const timeRetention = parseInt(params.get('timeRetention') || '30', 10)
      const full_view = params.get('full_view') === 'true'

      const res = await rpc.hr.attendance.get_report.query({
        month,
        year,
        timeRetentionMinutes: timeRetention,
      })

      const monthName = new Intl.DateTimeFormat('ru', { month: 'long' }).format(
        new Date(year, month, 1),
      )
      const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1)

      runInAction(() => {
        this.config.monthSelect.setMonth(month)
        this.config.monthSelect.setYear(year)
        this.config.timeRetention = timeRetention
        this.config.full_view = full_view

        this.report = new Report(
          res as AttendanceReport,
          `${monthLabel} ${year}`,
          timeRetention,
          full_view,
        )
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}

export const vm = new AttendanceReportVM()
