import { rpc } from 'lib/rpc.client'
import { notifier } from 'lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { ordersApi } from '../../orders.api'

export class OrderItem {
  id!: number
  name!: string
  description?: string | null
  quantity!: number
  assembler_name?: string | null
  constructor() {
    makeAutoObservable(this)
  }
}
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
    this.items = [...items].sort((a, b) => a.id - b.id)
  }

  async load(order_id: number) {
    const positions = await rpc.orders.positions.list.query({
      order_id: order_id
    })
    this.setItems(
      positions.map(p => {
        const item = new OrderItem()
        item.id = p.id
        item.name = p.name
        item.description = p.description
        item.quantity = p.quantity
        item.assembler_name = p.assembler_name ?? null
        return item
      })
    )
  }

  async save(orderId: number) {
    if (!this.canSave) throw new Error('No data to save')

    if (this.editedOrderItem?.id) {
      await this.updateOrderItem(orderId)
      notifier.ok('Позиция обновлена')
    } else {
      await this.insertOrderItem(orderId)
      notifier.ok(`Позиция "${this.name}" создана`)
    }
    this.closeDialog()
  }

  private async updateOrderItem(orderId: number) {
    const positionId = this.editedOrderItem?.id
    if (!positionId) {
      throw new Error('No order item to update')
    }
    if (!this.quantity) {
      throw new Error('Quantity is required')
    }
    await rpc.orders.positions.update.mutate({
      id: positionId,
      quantity: this.quantity,
      name: this.name,
      description: this.description
    })
    const item = this.items.find(item => item.id === positionId)
    if (item) {
      Object.assign(item, {
        quantity: this.quantity,
        name: this.name,
        description: this.description
      })
    }
  }

  private async insertOrderItem(orderId: number) {
    const result = await rpc.orders.positions.insert.mutate({
      order_id: orderId,
      name: this.name,
      quantity: this.quantity!,
      description: this.description
    })
    // update local state
    const item = new OrderItem()
    item.id = result.id
    item.name = this.name
    item.quantity = this.quantity!
    item.description = this.description
    this.items.push(item)
  }

  async delete(orderItemId: number, orderId: number) {
    await ordersApi.deleteOrderItem(orderItemId)
    this.setItems(this.items.filter(item => item.id !== orderItemId))
  }
}
