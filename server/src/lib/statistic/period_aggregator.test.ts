import { deepEqual, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import {
  MonthFrequencer,
  PeriodAggregator,
  QuarterFrequencer
} from './period_aggregator.js'

describe('period_aggregator', () => {
  test('frequencer', () => {
    const qfreq = new QuarterFrequencer()
    strictEqual(qfreq.bucket_key(new Date('2025-12-31')), '2025-Q4')
    strictEqual(qfreq.bucket_key(new Date('2025-01-01')), '2025-Q1')

    const mfreq = new MonthFrequencer()
    strictEqual(mfreq.bucket_key(new Date('2025-12-31')), '2025-12')
    strictEqual(mfreq.bucket_key(new Date('2025-01-01')), '2025-1')
  })

  test('aggregator', () => {
    const aggr = new PeriodAggregator({
      frequencer: new QuarterFrequencer(),
      period_start: new Date(2025, 0),
      period_end: new Date(2025, 11)
    })

    // First item
    // Q1
    aggr.add(1, new Date('2025-01-31'), 4.1)
    aggr.add(1, new Date('2025-02-15'), 9.17)

    // Q2
    aggr.add(1, new Date('2025-04-31'), 4.1)
    aggr.add(1, new Date('2025-04-15'), 9.17)

    deepEqual(aggr.bucket_keys(), ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4'])

    // Second item
    // Q1
    aggr.add(2, new Date('2025-01-31'), 2)
    aggr.add(2, new Date('2025-02-15'), 4)

    // Q2
    aggr.add(2, new Date('2025-09-31'), 6)
    aggr.add(2, new Date('2025-09-15'), 8)

    strictEqual(aggr.get(1)?.sum(), 13.27 * 2)
  })
})
