import { MonthSelectStore } from 'components/inputs/month-select'
import { LoadingController } from 'lib/loading_controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { AttendanceReport } from 'srv/service/attendance_report.generator'

export class AttendanceStore {
  async = new LoadingController()
  monthSelect = new MonthSelectStore()

  timeRetention: number = 30
  setTimeRetention(timeRetention: string) {
    this.timeRetention = parseInt(timeRetention)
  }

  showFullInfo: boolean = true
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
