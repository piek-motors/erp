export function parseRussianDate(
  value: string,
  endOfDay = false,
): Date | undefined {
  const [day, month, shortYear] = value.split('.').map(Number)
  if (value.length !== 8 || ![day, month, shortYear].every(Number.isInteger)) {
    return undefined
  }

  const date = new Date(2000 + shortYear, month - 1, day)
  if (
    date.getFullYear() !== 2000 + shortYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  if (endOfDay) date.setHours(23, 59, 59, 999)
  return date
}
