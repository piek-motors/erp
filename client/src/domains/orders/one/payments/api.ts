import { Payment } from 'domain-model'
import { apolloClient } from 'lib/api'
import * as gql from 'lib/types/graphql-shema'

export class PaymentsApi {
  static async load(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderPaymentsQuery,
      gql.GetOrderPaymentsQueryVariables
    >({
      query: gql.GetOrderPaymentsDocument,
      variables: { _eq: orderId }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    const payments = res.data?.orders_order_payments
    if (!payments) {
      throw new Error('Failed to load payments')
    }
    return payments.map(
      p =>
        new Payment({
          id: p.id,
          amount: p.amount,
          date: p.date
        })
    )
  }

  static async insert(payment: gql.InsertPaymentMutationVariables) {
    const res = await apolloClient.mutate<
      gql.InsertPaymentMutation,
      gql.InsertPaymentMutationVariables
    >({
      mutation: gql.InsertPaymentDocument,
      variables: payment
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    const id = res.data?.insert_orders_order_payments_one?.id
    if (!id) {
      throw new Error('Failed to insert payment')
    }
    return id
  }

  static async delete(paymentId: number) {
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
    const id = res.data?.delete_orders_order_payments_by_pk?.id
    if (!id) {
      throw new Error('Failed to delete payment')
    }
    return id
  }
}
