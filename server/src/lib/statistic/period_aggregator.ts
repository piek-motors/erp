import {
  addMonths,
  createDateAsUTC,
  isoMonthToQuarter,
  toDate,
} from '#root/lib/time.js'

interface BucketStrategy {
  key(ts: Date | number): string
}

interface StepStrategy {
  next(ts: Date): Date
}

export class QuarterStrategy implements BucketStrategy, StepStrategy {
  next(ts: Date): Date {
    return addMonths(ts, 3)
  }

  key(ts: Date | number): string {
    const d = toDate(ts)
    const year = d.getUTCFullYear()
    const quarter = Math.floor(d.getUTCMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }
}

export class MonthStrategy implements BucketStrategy, StepStrategy {
  next(ts: Date): Date {
    return addMonths(ts, 1)
  }

  key(ts: Date | number): string {
    const d = toDate(ts)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth() + 1
    return `${year}-${month}`
  }
}

class BucketSeries {
  readonly map = new Map<string, number>()

  constructor(init_keys: string[]) {
    init_keys.forEach(each => {
      this.map.set(each, 0)
    })
  }

  increment(key: string, value: number): Error | undefined {
    const prev = this.map.get(key)
    if (prev == null) {
      return Error(`No bucket with key ${key}`)
    }
    this.map.set(key, prev + value)
    return
  }

  size(): number {
    return this.map.size
  }

  percentile(p: number): number | null {
    if (this.map.size === 0) return null
    if (p < 0 || p > 100) {
      throw new Error('Percentile must be between 0 and 100')
    }
    const values = Array.from(this.map.values()).sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * values.length) - 1
    return values[Math.max(0, index)]
  }

  median(): number | null {
    return this.percentile(50)
  }

  sum(): number | null {
    let sum = 0
    for (const v of this.map.values()) {
      sum += v
    }
    return sum
  }

  get entries() {
    return Array.from(this.map.entries())
  }

  get(key: string) {
    return this.map.get(key)
  }

  get butcket_keys() {
    return Array.from(this.map.keys())
  }
}

export class TimeWindow {
  constructor(
    readonly start: Date,
    readonly end: Date,
    readonly strategy: TimeStrategy,
  ) {}

  get bucket_keys(): string[] {
    const keys: string[] = []
    let cursor = createDateAsUTC(this.start)
    const end = createDateAsUTC(this.end)

    while (cursor <= end) {
      keys.push(this.strategy.key(cursor))
      cursor = this.strategy.next(cursor)
    }

    return keys
  }
}

type TimeStrategy = BucketStrategy & StepStrategy

export class PeriodAggregator {
  private items: Map<number, BucketSeries> = new Map()

  constructor(
    private readonly window: TimeWindow,
    private readonly strategy: TimeStrategy,
  ) {}

  set(id: number, s: BucketSeries) {
    this.items.set(id, s)
  }

  add(id: number, ts: Date | number, value: number) {
    if (!this.items.has(id)) {
      this.items.set(id, new BucketSeries(this.window.bucket_keys))
    }

    const item = this.items.get(id) as BucketSeries
    const key = this.strategy.key(ts)
    item.increment(key, value)
  }

  get(id: number) {
    return this.items.get(id)
  }

  get iterator() {
    return this.items
  }
}

export class TimeSeriesRollup {
  moth_to_quarter_aggregation(monthly: BucketSeries) {
    const quarterly = new BucketSeries([])

    for (const [key, value] of monthly.entries) {
      const [year, month] = key.split('-')
      const quarter = isoMonthToQuarter(Number(month))
      const qkey = `${year}-Q${quarter}`

      if (!quarterly.map.has(qkey)) {
        quarterly.map.set(qkey, 0)
      }

      quarterly.increment(qkey, value)
    }

    return quarterly
  }
}
