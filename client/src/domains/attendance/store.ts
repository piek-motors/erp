import { MonthSelectStore } from 'components/inputs/month-select'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { AttendanceReport } from 'srv/service/attendance_report_generator'

export class AttendanceStore {
  async = new AsyncStoreController()
  monthSelect = new MonthSelectStore()

  timeRetention: number = 30
  setTimeRetention(timeRetention: string) {
    this.timeRetention = parseInt(timeRetention)
  }

  showFullInfo: boolean = false
  setShowFullInfo(showFullInfo: boolean) {
    this.showFullInfo = showFullInfo
  }

  report: AttendanceReport | null = null
  setReport(employees: AttendanceReport) {
    this.report = employees
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load(m: number, y: number) {
    const res = await this.async.run(async () =>
      rpc.attendance.getAttendanceList.query({
        month: m,
        year: y,
        timeRetentionMinutes: this.timeRetention,
        showFullInfo: this.showFullInfo
      })
    )
    this.setReport(res as AttendanceReport)
  }
}

export const store = new AttendanceStore()
