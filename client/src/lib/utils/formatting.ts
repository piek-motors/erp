import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export function formatMoney(value: number): string {
  if (!value) return ''
  return value.toLocaleString('ru-RU', {
    style: 'decimal'
  })
}

export function percentage(value: number, whole: number) {
  if (!value || !whole) return ''
  return ((value / whole) * 100).toFixed(0) + '%'
}

type FormatTime = {
  (seconds: number): string | null
  (date: string | moment.Moment): string | null
}

export const formatOnlyDate = (date: string) => {
  if (!date) return null
  return moment(date).format('DD.MM.YY')
}

/**
 * @returns  Numerical date with hours and minutes, e.g 8:31
 */
export const formatDateWithTime = (date: string) => {
  if (!date) return null
  moment.locale('ru')
  return moment(date).format('DD.MM.YY H:mm')
}

/**
 *  also converts seconds.
 * @returns hours and minutes, e.g 8:31
 */
export const formatTime: FormatTime = (
  payload: string | moment.Moment | number
) => {
  if (!payload) return null

  if (typeof payload === 'number') {
    return moment.utc(payload * 1000).format('H:mm')
  }

  return moment(payload).format('H:mm')
}

export function roundAndTrim(value: unknown, precision: number = 1): string {
  if (!value) return ''

  const num = typeof value === 'number' ? value : Number(value)
  if (isNaN(num) || num === 0) return '0'
  return parseFloat(num.toFixed(precision)).toString()
}

export function formatDetailDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
