import { OrderItem } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { ordersApi } from 'pages/orders/orders.api'

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
    const positions = await ordersApi.loadOrderItems(orderId)
    this.setItems(positions)
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

    await ordersApi.updateOrderItem({
      id: positionId,
      _set: {
        name: this.name,
        quantity: this.quantity!,
        description: this.description
      }
    })
    await this.load(orderId)
  }

  private async insertOrderItem(orderId: number) {
    await ordersApi.insertOrderItem({
      order_id: orderId,
      name: this.name,
      quantity: this.quantity!,
      description: this.description
    })
    await this.load(orderId)
  }

  async delete(orderItemId: number, orderId: number) {
    await ordersApi.deleteOrderItem(orderItemId)
    this.setItems(this.items.filter(item => item.id !== orderItemId))
  }
}
