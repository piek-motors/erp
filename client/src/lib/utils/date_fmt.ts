import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export function timeDeltaDays(t?: string | null | number) {
  if (!t) return null

  const t1 = new Date(t)
  if (isNaN(t1.getTime())) return null

  const now = new Date()
  const diffMs = now.getTime() - t1.getTime()
  if (diffMs <= 0) return null

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours <= 24) {
    return `< дн.`
  }

  const rtf = new Intl.RelativeTimeFormat('ru', {
    numeric: 'always',
    style: 'narrow',
  })
  const days = Math.floor(hours / 24)
  return rtf.format(-days, 'day').replace('-', '')
}

export const formatOnlyDate = (date?: string | Date | null) => {
  if (!date) return null
  return moment(date).format('DD.MM.YY')
}

export function fmtTimestamp(date: Date): string {
  return Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function fmtDate(
  date?: Date | string | null | number,
  noYear?: boolean,
): string {
  if (!date) return ''
  return Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: noYear ? undefined : '2-digit',
  }).format(new Date(date))
}

export function createDateAsUTC(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  )
}

export function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
}

const ruShortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
})

/**
 * Formats a date for UI display.
 *
 * If the date falls on today or yesterday (in local time),
 * returns a relative label ("Сегодня" / "Вчера").
 * Otherwise, falls back to a localized short calendar date
 * (e.g. "5 фев") using Intl.
 *
 * Intended for table cells, lists, and other compact UI elements.
 */
export const formatRelativeOrCalendarDate = (
  value: string | number | Date,
): string => {
  const date = new Date(value)

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startOfTargetDay = new Date(date)
  startOfTargetDay.setHours(0, 0, 0, 0)

  const dayDiff =
    (startOfToday.getTime() - startOfTargetDay.getTime()) /
    (24 * 60 * 60 * 1000)

  if (dayDiff === 0) return 'Сегодня'
  if (dayDiff === 1) return 'Вчера'

  return ruShortDateFormatter.format(date)
}
