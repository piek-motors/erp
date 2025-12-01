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
