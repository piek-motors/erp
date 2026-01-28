export function formatMoney(value: number): string {
	if (!value) return ''
	return Intl.NumberFormat('ru-RU', {
		style: 'decimal',
	}).format(value)
}

export function percentage(value: number, whole: number) {
	if (!value || !whole) return ''
	return ((value / whole) * 100).toFixed(0) + '%'
}

export function roundAndTrim(value: unknown, precision: number = 1): string {
	if (!value) return ''

	const num = typeof value === 'number' ? value : Number(value)
	if (isNaN(num) || num === 0) return '0'
	return parseFloat(num.toFixed(precision)).toString()
}
