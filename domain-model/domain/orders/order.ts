import { OrderStatus } from 'domain/orders/enums'
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
  assembler_name?: string
  constructor(init: ClassProperties<OrderItem>) {
    Object.assign(this, init)
  }
}

export class OrderAttachment {
  id!: number
  name!: string
  size?: number | null
  key!: string
  constructor(init: ClassProperties<OrderAttachment>) {
    Object.assign(this, init)
  }

  // converts file size from bytes to human-readable string
  sizeWithUnit(): string {
    if (!this.size) return '0 Bytes'
    var k = 1024,
      dm = 1,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(this.size) / Math.log(k))
    return parseFloat((this.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
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
  factoryNumber?: string | null
  city?: string | null
  manager!: User
  needAttention?: boolean
  awatingDispatch?: boolean
  createdAt!: Date
  acceptanceDate!: Date
  actualShippingDate!: Date
  comment?: string | null
  documents!: OrderAttachment[]
  status!: OrderStatus

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

  createdAtString(): string {
    if (!this.createdAt) return ''
    return moment(this.createdAt).format('DD.MM.YY')
  }

  shippingDateString(): string {
    if (!this.shippingDate) return ''
    return moment(this.shippingDate).format('DD.MM.YY')
  }

  acceptanceDateString(): string {
    if (!this.acceptanceDate) return ''
    return moment(this.acceptanceDate).format('DD.MM.YY')
  }

  actualShippingDateString(): string {
    if (!this.actualShippingDate) return ''
    return moment(this.actualShippingDate).format('DD.MM.YY')
  }

  managerString(): string {
    if (!this.manager) return ''
    return `${this.manager.firstName} ${this.manager.lastName}`
  }

  getBackgroundColor(): string {
    if (this.needAttention) return '#f5b9b9ba'
    if (this.awatingDispatch) return '#cae9b4a3'
    return ''
  }
}
