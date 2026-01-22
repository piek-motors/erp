import moment from 'moment'

export function timedeltaInSeconds(time1: string | Date, time2: string | Date) {
	const mtime1 = moment(time1, 'YYYY-MM-DDTHH:mm')
	const mtime2 = moment(time2, 'YYYY-MM-DDTHH:mm')
	var duration = moment.duration(mtime1.diff(mtime2))
	return Math.abs(duration.asSeconds())
}

export function fromMs(date?: number | null): Date | null {
	if (!date) return null
	return new Date(date)
}

export const formatDate = (date?: Date | null, withYear?: boolean) => {
	if (!date) return null
	return Intl.DateTimeFormat('ru-RU', {
		month: 'short',
		day: 'numeric',
		year: withYear ? '2-digit' : undefined,
	})
		.format(date)
		.replace(/\.$/, '')
}

export const createDateAsUTC = (date: Date) =>
	new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
		),
	)

export const convertDateToUTC = (date: Date) =>
	new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
	)

export function startOfUTCDay(d: Date): Date {
	return new Date(
		Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
	)
}

export function startOfUTCMonth(d: Date): Date {
	return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0))
}

export function addUTCMonths(d: Date, delta: number): Date {
	return new Date(
		Date.UTC(
			d.getUTCFullYear(),
			d.getUTCMonth() + delta,
			d.getUTCDate(),
			d.getUTCHours(),
			d.getUTCMinutes(),
			d.getUTCSeconds(),
			d.getUTCMilliseconds(),
		),
	)
}

export function toDate(ts: Date | number): Date {
	return ts instanceof Date ? ts : new Date(ts)
}

export function addMonths(date: Date, months: number): Date {
	const d = new Date(date)
	d.setUTCMonth(d.getUTCMonth() + months)
	return d
}

// move date forward to the start of its quarter (UTC)
export function startOfTheQuarter(date: Date): Date {
	const d = createDateAsUTC(date)

	const month = d.getUTCMonth() // 0–11
	const quarterStartMonth = Math.floor(month / 3) * 3

	// go to start of the quarter month
	return startOfUTCMonth(
		new Date(Date.UTC(d.getUTCFullYear(), quarterStartMonth, 1)),
	)
}

/**
 * @param month Human / ISO - 1-12
 */
export const isoMonthToQuarter = (month: number) =>
	Math.floor((month - 1) / 3) + 1
