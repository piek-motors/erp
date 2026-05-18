export class Payment {
  constructor(
    readonly id: number,
    readonly amount: number,
    readonly date: Date,
  ) {}
  getPecentOf(total: number) {
    if (!total) return ''
    return `${(this.amount / total).toFixed(0)}%`
  }
}

export class OrderItem {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly description: string | null,
    readonly qty: number,
  ) {}
}
