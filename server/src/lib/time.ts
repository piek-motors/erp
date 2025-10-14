import moment from 'moment'

export function timedeltaInSeconds(time1: string | Date, time2: string | Date) {
  const mtime1 = moment(time1, 'YYYY-MM-DDTHH:mm')
  const mtime2 = moment(time2, 'YYYY-MM-DDTHH:mm')
  var duration = moment.duration(mtime1.diff(mtime2))
  return Math.abs(duration.asSeconds())
}

/**
 * @returns hours and minutes, e.g 8:31
 */
export const formatTimeToHoursAndMinutes = (
  payload: string | moment.Moment | number
): string => {
  if (!payload) throw new Error('Payload is required')
  if (typeof payload === 'number') {
    return moment.utc(payload * 1000).format('H:mm')
  }
  return moment(payload).format('H:mm')
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
