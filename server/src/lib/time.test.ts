import { equal } from 'node:assert'
import test from 'node:test'
import { isoMonthToQuarter, startOfTheQuarter } from './time.js'

test('month to quarter', () => {
	equal(isoMonthToQuarter(1), 1)
	equal(isoMonthToQuarter(2), 1)
	equal(isoMonthToQuarter(3), 1)
	equal(isoMonthToQuarter(4), 2)
	equal(isoMonthToQuarter(5), 2)
	equal(isoMonthToQuarter(6), 2)
	equal(isoMonthToQuarter(7), 3)
	equal(isoMonthToQuarter(8), 3)
	equal(isoMonthToQuarter(9), 3)
	equal(isoMonthToQuarter(10), 4)
	equal(isoMonthToQuarter(11), 4)
	equal(isoMonthToQuarter(12), 4)
})

test('start of the quarter', () => {
	equal(
		startOfTheQuarter(new Date(2025, 11, 3))
			.toISOString()
			.split('T')[0],
		'2025-10-01',
	)
})
