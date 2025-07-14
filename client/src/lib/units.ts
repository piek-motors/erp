export function mm2m(mm: number, digits: number = 3): string {
  const m = mm / 1000
  // Remove trailing zeros and dot if integer
  return `${parseFloat(m.toFixed(digits))} м`
}
