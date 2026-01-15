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

export const formatDate = (date?: Date | null) => {
  if (!date) return null
  return Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    day: 'numeric'
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
      date.getSeconds()
    )
  )

export const convertDateToUTC = (date: Date) =>
  new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )

export function startOfUTCDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
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
      d.getUTCMilliseconds()
    )
  )
}
