export function formatMoney(value: number): string {
  if (!value) return ''

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol'
  })
}
