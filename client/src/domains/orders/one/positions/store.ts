import { makeAutoObservable } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import { notifier } from '@/lib/store/notifier.store'

class Position {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly description: string | null,
    readonly qty: number,
  ) {
    makeAutoObservable(this)
  }
}

export class PositionsStore {
  items: Position[] = []
  isOpen = false
  editedOrderItem: Position | null = null
  name = ''
  description = ''
  qty: number | null = null
  constructor() {
    makeAutoObservable(this)
  }
  openDialog(position: Position | null = null) {
    this.editedOrderItem = position
    this.isOpen = true
    if (position) {
      this.name = position.name ?? ''
      this.description = position.description ?? ''
      this.qty = position.qty
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
    this.qty = null
  }
  setName(value: string) {
    this.name = value
  }
  setDescription(value: string) {
    this.description = value
  }
  setQty(qty: number | null) {
    this.qty = qty
  }
  get canSave(): boolean {
    return Boolean(this.name && this.qty)
  }

  setItems(items: Position[]) {
    this.items = [...items].sort((a, b) => a.id - b.id)
  }

  async save(orderId: number) {
    if (!this.canSave) {
      throw new Error('No data to save')
    }
    if (this.editedOrderItem?.id) {
      await this.updateOrderItem()
      notifier.ok('Позиция обновлена')
    } else {
      await this.insertOrderItem(orderId)
      notifier.ok(`Позиция "${this.name}" создана`)
    }
    this.closeDialog()
  }

  private async updateOrderItem() {
    const positionId = this.editedOrderItem?.id
    if (!positionId) {
      throw new Error('No order item to update')
    }
    if (!this.qty) {
      throw new Error('Quantity is required')
    }
    await rpc.orders.positions.update.mutate({
      id: positionId,
      quantity: this.qty,
      name: this.name,
      description: this.description,
    })
    const item = this.items.find(item => item.id === positionId)
    if (item) {
      Object.assign(item, {
        quantity: this.qty,
        name: this.name,
        description: this.description,
      })
    }
  }

  private async insertOrderItem(orderId: number) {
    if (!this.qty) {
      throw new Error('Количество обязательно')
    }
    const result = await rpc.orders.positions.insert.mutate({
      order_id: orderId,
      name: this.name,
      quantity: this.qty,
      description: this.description,
    })
    this.items.push(
      new Position(result.id, this.name, this.description, this.qty),
    )
  }

  async delete(positionId: number) {
    await rpc.orders.positions.delete.mutate({ id: positionId })
    this.setItems(this.items.filter(item => item.id !== positionId))
  }
}
