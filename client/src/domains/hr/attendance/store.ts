import { makeAutoObservable } from 'mobx'
import { MonthSelectStore } from '@/components/inputs/month-select'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type { AttendanceReport } from '@/server/domains/hr/attendance/report_generator'

export class Report {
  constructor(
    readonly resp: AttendanceReport,
    readonly month: string,
    readonly timeRetention: number,
    readonly isFull: boolean,
  ) {}
}

export class AttendanceSt {
  loader = new LoadingController()
  monthSelect = new MonthSelectStore()
  report: Report | null = null

  timeRetention: number = 30
  setTimeRetention(timeRetention: string) {
    this.timeRetention = parseInt(timeRetention)
  }

  showFullInfo: boolean = true
  setShowFullInfo(showFullInfo: boolean) {
    this.showFullInfo = showFullInfo
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    const res = await this.loader.run(() =>
      rpc.hr.attendance.get_report.query({
        month: this.monthSelect.month,
        year: this.monthSelect.year,
        timeRetentionMinutes: this.timeRetention,
        showFullInfo: this.showFullInfo,
      }),
    )
    this.report = new Report(
      res as AttendanceReport,
      this.monthSelect.getMonthLabel(),
      this.timeRetention,
      this.showFullInfo,
    )
  }

  reset() {
    this.report = null
  }
}

export const store = new AttendanceSt()
