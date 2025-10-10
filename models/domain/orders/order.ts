type ClassProperties<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export class Payment {
  id!: number
  amount!: number
  date!: Date
  constructor(init: ClassProperties<Payment>) {
    Object.assign(this, init)
  }
  getPecentOf(total: number) {
    if (!total) return ''
    return `${(this.amount / total).toFixed(0)}%`
  }
}

export class OrderItem {
  id!: number
  name!: string
  description?: string | null
  quantity!: number
  assembler_name?: string
  constructor(init: ClassProperties<OrderItem>) {
    Object.assign(this, init)
  }
}
