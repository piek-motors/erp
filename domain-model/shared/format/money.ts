export function formatMoney(value: number): string {
  if (!value) return ''

  return value.toLocaleString('ru-RU', {
    style: 'decimal'
  })
}
