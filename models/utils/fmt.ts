/**
 * Formats a number as a string with thousand separators according to Russian locale.
 *
 * @param value - The number to format
 * @returns A string with thousand separators, e.g. 1234567 -> "1 234 567".
 *          Returns an empty string if the value is 0, null, or undefined.
 */
export function money(value: number): string {
  if (!value) return ''
  return Intl.NumberFormat('ru-RU', {
    style: 'decimal',
  }).format(value)
}

/**
 * Calculates the percentage of a value relative to a total.
 *
 * @param value - The part value
 * @param whole - The total value
 * @returns A string representing the percentage, rounded to the nearest whole number with a "%" symbol.
 *          For example, percentage(25, 200) -> "13%".
 *          Returns an empty string if either value or whole is 0, null, or undefined.
 */
export function percentage(value: number, whole: number): string {
  if (!value || !whole) return ''
  return ((value / whole) * 100).toFixed(0) + '%'
}

/**
 * Rounds a number to a specified precision and trims unnecessary zeros.
 *
 * @param value - The number (or string) to round
 * @param precision - Number of decimal places (default is 1)
 * @returns A string with the rounded number, without trailing zeros.
 *          Returns an empty string if the value is invalid, null, or undefined.
 *          Example: roundAndTrim(1.2345, 2) -> "1.23", roundAndTrim(0) -> "0"
 */
export function roundAndTrim(value: unknown, precision: number = 1): number {
  if (!value) return 0

  const num = typeof value === 'number' ? value : Number(value)
  if (isNaN(num) || num === 0) return 0
  return parseFloat(num.toFixed(precision))
}

const plural = new Intl.PluralRules('ru')

/**
 * Formats a numeric day count using correct Russian pluralization rules.
 *
 * Applies the 3-form plural system:
 * - 1, 21, 31...      → "день"
 * - 2–4, 22–24...     → "дня"
 * - 0, 5–20, 11–14... → "дней"
 *
 * The value is floored and converted to absolute.
 *
 * @param days - Number of days (can be fractional or negative)
 * @returns Formatted string with correctly pluralized unit
 */
export const day_count = (days: number) => {
  const n = Math.floor(Math.abs(days))
  const forms: Record<string, string> = {
    one: 'день',
    few: 'дня',
    many: 'дней',
    other: 'дней',
  }
  return `${n} ${forms[plural.select(n)]}`
}
