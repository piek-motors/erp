import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export function timeDeltaDays(t?: string | null) {
  if (!t) return null

  const t1 = new Date(Number(t))
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
    style: 'narrow'
  })
  const days = Math.floor(hours / 24)
  return rtf.format(-days, 'day')
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
    minute: '2-digit'
  }).format(date)
}

export function fmtDate(date?: Date | string | null, noYear?: boolean): string {
  if (!date) return ''
  return Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: noYear ? undefined : '2-digit'
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
      date.getSeconds()
    )
  )
}

export function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}
