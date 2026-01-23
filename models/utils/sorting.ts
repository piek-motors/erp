export const sort_rus = <T>(items: T[], getValue: (item: T) => string): T[] =>
	items.toSorted((a, b) =>
		getValue(a).localeCompare(getValue(b), 'ru', {
			numeric: true,
			sensitivity: 'base',
		}),
	)
