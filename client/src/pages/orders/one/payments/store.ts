import { apolloClient } from 'api'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'

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
  }
  closeModal() {
    this.modalOpen = false
    this.clear()
  }
  clear() {
    this.date = null
    this.amount = null
    this.error = null
  }
  async loadPayments() {
    this.assertOrderId()
    this.setLoading(true)
    try {
      const res = await apolloClient.query<
        gql.GetOrderPaymentsQuery,
        gql.GetOrderPaymentsQueryVariables
      >({
        query: gql.GetOrderPaymentsDocument,
        variables: { _eq: this.orderId },
        fetchPolicy: 'network-only'
      })

      this.setPayments(res.data?.orders_order_payments || [])
    } catch (error) {
      this.setError(error as Error)
    } finally {
      this.setLoading(false)
    }
  }

  async insertPayment() {
    this.assertOrderId()
    if (!this.date || !this.amount) {
      throw new Error('Invalid input: orderId, date, and amount are required')
    }

    this.setLoading(true)
    try {
      const res = await apolloClient.mutate<
        gql.InsertPaymentMutation,
        gql.InsertPaymentMutationVariables
      >({
        mutation: gql.InsertPaymentDocument,
        variables: {
          order_id: this.orderId,
          date: this.date,
          amount: this.amount
        }
      })

      const paymentId = res.data?.insert_orders_order_payments_one?.id
      if (!paymentId) {
        throw new Error('Failed to insert payment')
      }

      // Reload payments to get updated list
      await this.loadPayments()
      this.closeModal()

      return paymentId
    } catch (error) {
      this.setError(error as Error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async deletePayment(paymentId: number) {
    this.setLoading(true)
    try {
      const res = await apolloClient.mutate<
        gql.DeletePaymentMutation,
        gql.DeletePaymentMutationVariables
      >({
        mutation: gql.DeletePaymentDocument,
        variables: { id: paymentId }
      })

      if (res.errors) {
        throw new Error(res.errors.toString())
      }

      this.setPayments(this.payments.filter(p => p.id !== paymentId))
    } catch (error) {
      this.setError(error as Error)
      throw error
    } finally {
      this.setLoading(false)
    }
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
}

export const paymentStore = new PaymentStore()