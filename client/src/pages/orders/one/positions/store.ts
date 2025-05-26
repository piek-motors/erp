import { apolloClient } from 'api'
import { OrderItem } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { map } from 'pages/orders/mappers'
import * as gql from 'types/graphql-shema'

export class PositionsStore {
  items: OrderItem[] = []
  isOpen = false
  editedOrderItem: Partial<OrderItem> | null = null
  name = ''
  description = ''
  quantity: number | null = null
  constructor() {
    makeAutoObservable(this)
  }
  openDialog(orderItem: Partial<OrderItem> | null = null) {
    this.editedOrderItem = orderItem
    this.isOpen = true
    if (orderItem) {
      this.name = orderItem.name ?? ''
      this.description = orderItem.description ?? ''
      this.quantity = orderItem.quantity ?? null
    } else {
      this.clear()
    }
  }
  closeDialog() {
    this.isOpen = false
    this.editedOrderItem = null
    this.clear()
  }
  clear() {
    this.name = ''
    this.description = ''
    this.quantity = null
  }
  setName(value: string) {
    this.name = value
  }
  setDescription(value: string) {
    this.description = value
  }
  setQuantity(value: string) {
    this.quantity = value ? parseInt(value, 10) : null
  }
  get canSave(): boolean {
    return Boolean(this.name && this.quantity)
  }

  setItems(items: OrderItem[]) {
    items.sort((a, b) => a.id - b.id)
    this.items = items
  }

  async load(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderPositionsQuery,
      gql.GetOrderPositionsQueryVariables
    >({
      query: gql.GetOrderPositionsDocument,
      variables: { order_id: orderId },
      fetchPolicy: 'network-only'
    })
    this.setItems(res.data.orders_order_items.map(map.orderItem.fromDto))
  }

  async save(orderId: number) {
    if (!this.canSave) throw new Error('No data to save')

    if (this.editedOrderItem?.id) {
      await this.updateOrderItem(orderId)
    } else {
      await this.insertOrderItem(orderId)
    }
    this.closeDialog()
  }

  private async updateOrderItem(orderId: number) {
    const positionId = this.editedOrderItem?.id
    if (!positionId) {
      throw new Error('No order item to update')
    }

    const res = await apolloClient.mutate<
      gql.UpdateOrderItemByPkMutation,
      gql.UpdateOrderItemByPkMutationVariables
    >({
      mutation: gql.UpdateOrderItemByPkDocument,
      variables: {
        id: positionId,
        _set: {
          name: this.name,
          quantity: this.quantity!,
          description: this.description
        }
      }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    await this.load(orderId)
  }

  private async insertOrderItem(orderId: number) {
    const res = await apolloClient.mutate<
      gql.InsertOrderItemMutation,
      gql.InsertOrderItemMutationVariables
    >({
      mutation: gql.InsertOrderItemDocument,
      variables: {
        order_id: orderId,
        name: this.name,
        quantity: this.quantity!,
        description: this.description
      }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    await this.load(orderId)
  }

  async delete(orderItemId: number, orderId: number) {
    await apolloClient.mutate<
      gql.DeleteOrderItemByPkMutation,
      gql.DeleteOrderItemByPkMutationVariables
    >({
      mutation: gql.DeleteOrderItemByPkDocument,
      variables: { id: orderItemId }
    })
    this.setItems(this.items.filter(item => item.id !== orderItemId))
  }
}
