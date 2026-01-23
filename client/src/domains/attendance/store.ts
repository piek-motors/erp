import { MonthSelectStore } from 'components/inputs/month-select'
import { rpc } from 'lib/rpc/rpc.client'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import type { AttendanceReport } from 'srv/rpc/attendance/report_generator'

export class Report {
	constructor(
		readonly resp: AttendanceReport,
		readonly month: string,
		readonly timeRetention: number,
		readonly isFull: boolean,
	) {}
}

export class AttendanceStore {
	loader = new LoadingController()
	monthSelect = new MonthSelectStore()
	report?: Report

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
			rpc.attendance.get_report.query({
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
		this.report = undefined
	}
}

export const store = new AttendanceStore()
