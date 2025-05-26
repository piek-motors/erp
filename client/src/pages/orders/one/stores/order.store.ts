import { apolloClient } from 'api/apollo-client'
import { Order, OrderStatus } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { map } from 'pages/orders/mappers'
import * as gql from 'types/graphql-shema'
import { AttachmentsStore } from '../attachments/store'
import { PaymentStore } from '../payments/store'
import { PositionsStore } from '../positions/store'
import { StatementStore } from '../statement/store'

export class OrderStore {
  order: Order | null = null
  statment = new StatementStore()
  attachments = new AttachmentsStore()
  positions = new PositionsStore()
  payments = new PaymentStore()
  editMode = false

  constructor() {
    makeAutoObservable(this)
  }

  async init(orderId: number) {
    await Promise.all([
      this.statment.init(orderId),
      this.loadOrder(orderId),
      this.payments.init(orderId),
      this.positions.load(orderId)
    ])
  }

  setOrder(order: Order) {
    this.order = order
  }

  updateOrderState(order: Partial<Order>) {
    this.assertOrderExists()
    this.order = new Order({ ...this.order, ...order })
  }

  switchEditMode() {
    this.editMode = !this.editMode
  }

  enableEditMode() {
    this.editMode = true
  }

  async loadOrder(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderByPkQuery,
      gql.GetOrderByPkQueryVariables
    >({
      query: gql.GetOrderByPkDocument,
      variables: { id: orderId }
    })
    this.setOrder(map.order.fromDto(res.data?.orders_orders[0]))
  }

  async updateOrder(orderId: number) {
    return this.executeMutation(
      apolloClient.mutate<
        gql.UpdateOrderInfoMutation,
        gql.UpdateOrderInfoMutationVariables
      >({
        mutation: gql.UpdateOrderInfoDocument,
        variables: this.statment.prepareForUpdate(orderId),
        refetchQueries: [gql.GetOrderByPkDocument]
      })
    )
  }

  async insertOrder(status: OrderStatus): Promise<number> {
    const data = this.statment.prepareForUpdate(status)
    if (!data.fields) {
      throw new Error('No data to insert')
    }

    const res = await this.executeMutation(
      apolloClient.mutate<
        gql.InsertOrderMutation,
        gql.InsertOrderMutationVariables
      >({
        mutation: gql.InsertOrderDocument,
        variables: {
          object: {
            ...data.fields,
            status
          }
        }
      })
    )

    const orderId = res.data?.insert_orders_orders_one?.id
    if (!orderId) {
      throw new Error(`Failed to insert order: ${res.errors?.toString()}`)
    }
    return orderId
  }

  async deleteOrder() {
    this.assertOrderExists()
    return this.executeMutation(
      apolloClient.mutate<
        gql.DeleteOrderMutation,
        gql.DeleteOrderMutationVariables
      >({
        mutation: gql.DeleteOrderDocument,
        variables: { id: this.order.id }
      })
    )
  }

  async moveToArchive(
    status: OrderStatus.Archived | OrderStatus.ReclamationArchived
  ) {
    this.assertOrderExists()
    const res = await this.executeMutation(
      apolloClient.mutate<
        gql.MoveOrderToArchiveMutation,
        gql.MoveOrderToArchiveMutationVariables
      >({
        mutation: gql.MoveOrderToArchiveDocument,
        variables: {
          id: this.order.id,
          actual_shipping_date: new Date(),
          status: OrderStatus.Archived
        },
        refetchQueries: [gql.GetOrderByPkDocument]
      })
    )

    await this.loadOrder(this.order.id)
    return res
  }

  async moveToPriority() {
    this.assertOrderExists()
    const res = await this.executeMutation(
      apolloClient.mutate<
        gql.MoveOrderToPriorityMutation,
        gql.MoveOrderToPriorityMutationVariables
      >({
        mutation: gql.MoveOrderToPriorityDocument,
        variables: {
          id: this.order.id,
          acceptance_date: new Date()
        },
        refetchQueries: [gql.GetOrderByPkDocument]
      })
    )

    await this.loadOrder(this.order.id)
    return res
  }

  async updateAwaitingDispatch() {
    this.assertOrderExists()
    const res = await this.executeMutation(
      apolloClient.mutate<
        gql.UpdateAwaitingDispatchMutation,
        gql.UpdateAwaitingDispatchMutationVariables
      >({
        mutation: gql.UpdateAwaitingDispatchDocument,
        variables: {
          id: this.order.id,
          awaiting_dispatch: !this.order.awatingDispatch
        }
      })
    )

    await this.loadOrder(this.order.id)
    return res
  }

  async updateNeedAttention() {
    this.assertOrderExists()
    const res = await this.executeMutation(
      apolloClient.mutate<
        gql.UpdateNeedAttentionMutation,
        gql.UpdateNeedAttentionMutationVariables
      >({
        mutation: gql.UpdateNeedAttentionDocument,
        variables: {
          id: this.order.id,
          need_attention: this.order.needAttention ? 'false' : 'true'
        }
      })
    )

    await this.loadOrder(this.order.id)
    return res
  }

  private assertOrderExists(): asserts this is { order: Order } {
    if (!this.order) {
      throw new Error('Order not found')
    }
  }

  private async executeMutation<T extends { errors?: any }>(
    mutation: Promise<T>
  ): Promise<T> {
    const res = await mutation
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res
  }
}

export const orderStore = new OrderStore()
