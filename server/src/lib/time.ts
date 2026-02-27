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

export const formatDate = <D extends Date | null>(
  date?: D,
  withYear?: boolean,
) => {
  if (!date) return null
  return Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    day: 'numeric',
    year: withYear ? '2-digit' : undefined,
  })
    .format(date)
    .replace(/\.$/, '')
}

/**
 * Reinterprets a local Date's wall-clock components as UTC.
 *
 * IMPORTANT:
 * This DOES NOT convert the date to UTC.
 * It takes the local year/month/day/hour/minute/second values
 * and constructs a new Date assuming those values are already UTC.
 *
 * Effect:
 * - Shifts the absolute timestamp.
 * - Produces a different moment in time.
 *
 * Example (system TZ = UTC+3):
 * Local date: 2025-02-27 10:00 (UTC+3)
 * Internally: 2025-02-27 07:00 UTC
 *
 * Result of this function:
 * 2025-02-27 10:00 UTC
 * (= 13:00 local time)
 *
 * Use case:
 * - When you have a wall-clock time that should be interpreted as UTC.
 * - Typically used when parsing external local timestamps that must be stored as UTC.
 */
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

/**
 * Rebuilds a Date using its UTC components as local time components.
 *
 * IMPORTANT:
 * This also DOES NOT convert a date to UTC.
 * It extracts UTC parts and reconstructs a Date using the local constructor.
 *
 * Effect:
 * - Shifts the absolute timestamp.
 * - Produces a different moment in time.
 *
 * Example (system TZ = UTC+3):
 * Original local: 2025-02-27 10:00 (UTC+3)
 * Internal UTC: 2025-02-27 07:00
 *
 * getUTCHours() => 7
 * new Date(..., 7) => 07:00 local
 * (= 04:00 UTC)
 *
 * Use case:
 * - Rarely correct.
 * - Only valid if you explicitly need to reinterpret UTC fields as local time.
 *
 * Warning:
 * Most applications DO NOT need this.
 * JavaScript Date already stores timestamps in UTC internally.
 */
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

export function endOfUTCMonth(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999),
  )
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
