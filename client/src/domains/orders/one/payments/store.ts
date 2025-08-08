import * as gql from 'lib/types/graphql-shema'
import { makeAutoObservable } from 'mobx'
import { Order, Payment } from 'models'
import moment from 'moment'
import { PaymentsApi } from './api'

export class PaymentStore {
  modalOpen = false
  orderId: number | null = null
  date: string | null = null
  amount: number | null = null
  payments: gql.GetOrderPaymentsQuery['orders_order_payments'] = []
  loading = false
  error: Error | null = null

  constructor() {
    makeAutoObservable(this)
  }

  init(orderId: number) {
    this.orderId = orderId
    this.loadPayments()
    this.setDate(moment().local().format('DD.MM.YY'))
  }

  setDate(date: string | null) {
    this.date = date
  }
  setAmount(amount: number | null) {
    this.amount = amount
  }
  setLoading(loading: boolean) {
    this.loading = loading
  }
  setError(error: Error | null) {
    this.error = error
  }
  setPayments(payments: gql.GetOrderPaymentsQuery['orders_order_payments']) {
    this.payments = payments
  }
  openModal() {
    this.modalOpen = true
    this.date = moment().local().format('DD.MM.YY')
  }
  closeModal() {
    this.modalOpen = false
    this.amount = null
  }
  clear() {
    this.orderId = null
    this.date = null
    this.amount = null
    this.error = null
  }

  async loadPayments() {
    this.assertOrderId()
    return this.withStateManagement(async () => {
      const payments = await PaymentsApi.load(this.orderId)
      this.setPayments(payments)
    })
  }

  async insertPayment(order: Order) {
    this.assertOrderId()

    return this.withStateManagement(async () => {
      if (!this.date || !this.amount) {
        throw Error('Invalid input: date, and amount are required')
      }

      if (this.amount > order.totalAmount) {
        throw Error('Amount is greater than total amount')
      }

      const paymentDate = moment(this.date, 'DD.MM.YY').utc(true)
      if (!paymentDate.isValid()) {
        throw Error('Invalid date format')
      }

      const paymentId = await PaymentsApi.insert({
        order_id: this.orderId,
        date: paymentDate.toISOString(),
        amount: this.amount
      })

      this.setPayments([
        ...this.payments,
        new Payment({
          id: paymentId,
          amount: this.amount,
          date: paymentDate.toDate()
        })
      ])

      this.closeModal()
      return paymentId
    })
  }

  async deletePayment(paymentId: number) {
    return this.withStateManagement(async () => {
      await PaymentsApi.delete(paymentId)
      this.setPayments(this.payments.filter(p => p.id !== paymentId))
    })
  }

  get totalPaid() {
    return this.payments.reduce((acc, payment) => acc + payment.amount, 0)
  }

  getTotalPaidPercentage(totalAmount: number) {
    if (!totalAmount) return '0%'
    return `${((this.totalPaid / totalAmount) * 100).toFixed(0)}%`
  }

  private assertOrderId(): asserts this is { orderId: number } {
    if (!this.orderId) {
      throw new Error('Order ID is not set')
    }
  }

  private async withStateManagement<T>(fn: () => Promise<T>) {
    this.setLoading(true)
    try {
      return await fn()
    } catch (error) {
      this.setError(error as Error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export const paymentStore = new PaymentStore()
