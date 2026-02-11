export const ru_short_date_formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
})

const Day = 24 * 60 * 60 * 1000
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
export const fmt_relative_or_calendar_date = (
  value: string | number | Date,
): string => {
  const date = new Date(value)

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startOfTargetDay = new Date(date)
  startOfTargetDay.setHours(0, 0, 0, 0)

  const dayDiff = (startOfToday.getTime() - startOfTargetDay.getTime()) / Day

  if (dayDiff === 0) return 'Сегодня'
  if (dayDiff === 1) return 'Вчера'

  return ru_short_date_formatter.format(date)
}
