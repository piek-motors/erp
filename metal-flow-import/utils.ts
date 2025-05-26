export function parseExcelNumber(value: string): number {
  const r = Number(value.replace(',', '.'))
  return r
}
