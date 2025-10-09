import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export class NullTimeError extends Error {}

export function timedeltaInSeconds(
  time1: string | null | undefined,
  time2: string | null | undefined
) {
  if (!time1 || !time2) {
    return new NullTimeError()
  }

  const mtime1 = moment(time1, 'YYYY-MM-DDTHH:mm')
  const mtime2 = moment(time2, 'YYYY-MM-DDTHH:mm')
  var duration = moment.duration(mtime1.diff(mtime2))
  return Math.abs(duration.asSeconds())
}

export function sec2hours(seconds: number) {
  return (seconds / 3600).toFixed(0)
}
