import { addMonths, createDateAsUTC, toDate } from '#root/lib/time.js'

interface Frequencer {
  bucket_key(ts: Date | number): string
  next(ts: Date): Date
}

export class QuarterFrequencer implements Frequencer {
  next(ts: Date): Date {
    return addMonths(ts, 3)
  }

  bucket_key(ts: Date | number): string {
    const d = toDate(ts)
    const year = d.getUTCFullYear()
    const quarter = Math.floor(d.getUTCMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }
}

export class MonthFrequencer implements Frequencer {
  next(ts: Date): Date {
    return addMonths(ts, 1)
  }

  bucket_key(ts: Date | number): string {
    const d = toDate(ts)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth() + 1
    return `${year}-${month}`
  }
}

class Buckets {
  private readonly map = new Map<string, number>()

  constructor(readonly frequencer: Frequencer, init_keys: string[]) {
    init_keys.forEach(each => this.map.set(each, 0))
  }

  add(ts: Date | number, value: number) {
    const key = this.frequencer.bucket_key(ts)
    const prev = this.map.get(key)
    if (prev == null) {
      throw Error(`No bucket with key ${key}`)
    }
    this.map.set(key, prev + value)
  }

  count_buckets(): number {
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

  get raw() {
    return Array.from(this.map.entries())
  }
}

export interface PeriodAggregatorArgs {
  frequencer: Frequencer
  period_start: Date
  period_end: Date
}

export class PeriodAggregator {
  private items: Map<number, Buckets> = new Map()
  constructor(private readonly buckets_args: PeriodAggregatorArgs) {}

  add(id: number, timestamp: Date | number, value: number) {
    if (!this.items.has(id)) {
      this.items.set(id, this.new_bucket())
    }

    const item = this.items.get(id) as Buckets
    item.add(timestamp, value)
  }

  get(id: number) {
    return this.items.get(id)
  }

  bucket_keys() {
    const start = createDateAsUTC(this.buckets_args.period_start)
    const end = createDateAsUTC(this.buckets_args.period_end)
    const { frequencer } = this.buckets_args
    const buckets_keys: string[] = []

    let cursor = start
    while (cursor <= end) {
      buckets_keys.push(frequencer.bucket_key(cursor))
      cursor = frequencer.next(cursor)
    }

    return buckets_keys
  }

  private new_bucket() {
    return new Buckets(this.buckets_args.frequencer, this.bucket_keys())
  }
}
