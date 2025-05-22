import * as moment from 'moment'
import { formatMoney } from '../../shared/format/money'
import { User } from '../user'

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
  constructor(init: ClassProperties<OrderItem>) {
    Object.assign(this, init)
  }
}

export class Order {
  id!: number
  totalAmount!: number
  invoiceNumber?: string | null
  payments!: Payment[]
  shippingDate!: Date
  items!: OrderItem[]
  contractor?: string | null
  city?: string | null
  manager!: User
  needAttention?: boolean
  awatingDispatch?: boolean

  constructor(init: ClassProperties<Order>) {
    Object.assign(this, init)
  }

  totalPaid(): number {
    return this.payments.reduce((acc, payment) => acc + payment.amount, 0)
  }

  totalPaidString(): string {
    return formatMoney(this.totalPaid())
  }

  paidPercentage(): string {
    if (!this.totalAmount) return ''
    return `${((this.totalPaid() / this.totalAmount) * 100).toFixed(0)}%`
  }

  shippingDateString(): string {
    if (!this.shippingDate) return ''

    return moment(this.shippingDate).format('DD.MM.YY')
  }

  managerString(): string {
    if (!this.manager) return ''
    return `${this.manager.firstName} ${this.manager.lastName}`
  }

  addPayment(payment: Payment) {
    this.payments.push(payment)
  }

  addOrderItem(orderItem: OrderItem) {
    this.items.push(orderItem)
  }
}
