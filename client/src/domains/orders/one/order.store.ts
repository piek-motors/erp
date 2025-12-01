import { AttachmentsStore } from 'components/attachments/store'
import { UnpackedOrder } from 'domains/orders/api'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Attachment, OrderItem, OrderStatus, Payment } from 'models'
import { CommentsStore } from './comments/store'
import { PaymentStore } from './payments/store'
import { PositionsStore } from './positions/store'
import { StatementStore } from './statement/store'

export class OrderStore {
  order: UnpackedOrder | null = null
  statment = new StatementStore()
  attachments = new AttachmentsStore()
  positions = new PositionsStore()
  payments = new PaymentStore()
  comments = new CommentsStore()
  editMode = false
  error: Error | null = null

  constructor() {
    makeAutoObservable(this)
  }

  openOrder(orderId: number) {
    this.clear()
    Promise.all([
      this.statment.init(orderId),
      this.loadOrder(orderId),
      this.payments.init(orderId)
    ])
  }

  setOrder(order: UnpackedOrder) {
    this.order = order
  }

  updateOrderState(order: Partial<UnpackedOrder>) {
    if (!this.order) return
    this.order = { ...this.order, ...order } as UnpackedOrder
  }

  switchEditMode() {
    this.editMode = !this.editMode
  }

  enableEditMode() {
    this.editMode = true
  }

  async loadOrder(orderId: number) {
    const order = await rpc.orders.get.query({ id: orderId })
    this.setOrder({
      ...order,
      payments: [],
      created_at: new Date(order.created_at),
      shipping_date: order.shipping_date ? new Date(order.shipping_date) : null,
      acceptance_date: order.acceptance_date
        ? new Date(order.acceptance_date)
        : null,
      actual_shipping_date: order.actual_shipping_date
        ? new Date(order.actual_shipping_date)
        : null,
      positions: [],
      comments: [],
      attachments: []
    })
    this.positions.setItems(
      order.positions.map(p => {
        const item = new OrderItem({
          id: p.id,
          name: p.name,
          description: p.description,
          quantity: p.quantity
        })
        return item
      })
    )
    this.payments.setPayments(
      order.payments.map(
        p =>
          new Payment({
            id: p.id,
            amount: p.amount,
            date: new Date(p.date)
          })
      )
    )
    this.comments.setComments(
      order.comments.map(comment => ({
        ...comment,
        created_at: new Date(comment.created_at),
        first_name: comment.first_name ?? '',
        last_name: comment.last_name ?? ''
      }))
    )
    this.attachments.setFiles(
      order.attachments.map(
        attachment =>
          new Attachment(
            attachment.id,
            attachment.filename,
            attachment.size,
            attachment.key
          )
      )
    )
    this.statment.applyState(order)
  }

  async update() {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    const payload = this.statment.prepareForUpdate(id)
    if (!('id' in payload)) {
      throw new Error('Order id is not set')
    }
    await this.try(() => rpc.orders.update.mutate(payload))
    await this.loadOrder(id)
  }

  async insertOrder(status: OrderStatus): Promise<number> {
    const data = this.statment.prepareForUpdate(status)
    if (!data) {
      throw new Error('No data to insert')
    }
    delete data['id']
    const res = await this.try(() =>
      rpc.orders.insert.mutate({
        ...data,
        status
      })
    )
    return res.id
  }

  async deleteOrder() {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    await this.try(() => rpc.orders.delete.mutate({ id }))
  }

  async moveToArchive(
    status: OrderStatus.Archived | OrderStatus.ReclamationArchived
  ) {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    await this.try(() =>
      rpc.orders.update.mutate({
        id,
        actual_shipping_date: Date.now(),
        status
      })
    )
    await this.loadOrder(id)
  }

  async moveToPriority() {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    await this.try(() =>
      rpc.orders.update.mutate({
        id,
        acceptance_date: Date.now(),
        status: OrderStatus.InProduction
      })
    )
    await this.loadOrder(id)
  }

  async updateAwaitingDispatch() {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    await this.try(() =>
      rpc.orders.update.mutate({
        id,
        awaiting_dispatch: !this.order?.awaiting_dispatch
      })
    )
    await this.loadOrder(id)
  }

  async updateNeedAttention() {
    const id = this.order?.id
    if (!id) {
      throw new Error('Order id is not set')
    }
    await this.try(() =>
      rpc.orders.update.mutate({
        id,
        need_attention: this.order?.need_attention ? null : 'true'
      })
    )
    await this.loadOrder(id)
  }

  private async try<T extends any>(mutation: () => Promise<T>): Promise<T> {
    try {
      const res = await mutation()
      return res
    } catch (e) {
      if (e instanceof Error) {
        this.error = e
      } else {
        this.error = new Error(String(e))
      }
      throw e
    }
  }

  clear() {
    this.statment.clear()
    this.positions.clear()
    this.payments.clear()
    this.order = null
    this.error = null
  }
}

export const orderStore = new OrderStore()
