import { Order, OrderStatus } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { ordersApi } from 'pages/orders/orders.api'
import * as gql from 'types/graphql-shema'
import { AttachmentsStore } from '../../../../components/attachments/store'
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
  error: Error | null = null

  constructor() {
    makeAutoObservable(this)
  }

  openOrder(orderId: number) {
    this.clear()
    Promise.all([
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
    const order = await ordersApi.getOrder(orderId)
    this.setOrder(order)
  }

  async update() {
    this.assertOrderExists()

    const payload = this.statment.prepareForUpdate(this.order.id)
    const res = await this.try(() => ordersApi.updateOrder(payload))
    await this.loadOrder(this.order.id)
    return res
  }

  async insertOrder(status: OrderStatus): Promise<number> {
    const data = this.statment.prepareForUpdate(status)
    if (!data.fields) {
      throw new Error('No data to insert')
    }
    const payload: gql.InsertOrderMutationVariables = {
      object: {
        ...data.fields,
        status
      }
    }
    const id = await this.try(() => ordersApi.insertOrder(payload))
    return id
  }

  async deleteOrder() {
    this.assertOrderExists()
    return this.try(() => ordersApi.deleteOrder({ id: this.order.id }))
  }

  async moveToArchive(
    status: OrderStatus.Archived | OrderStatus.ReclamationArchived
  ) {
    this.assertOrderExists()
    const payload: gql.MoveOrderToArchiveMutationVariables = {
      id: this.order.id,
      actual_shipping_date: new Date(),
      status
    }
    await this.try(() => ordersApi.moveToArchive(payload))
    await this.loadOrder(this.order.id)
  }

  async moveToPriority() {
    this.assertOrderExists()
    const payload: gql.MoveOrderToPriorityMutationVariables = {
      id: this.order.id,
      acceptance_date: new Date()
    }
    await this.try(() => ordersApi.moveToPriority(payload))
    await this.loadOrder(this.order.id)
  }

  async updateAwaitingDispatch() {
    this.assertOrderExists()
    const payload: gql.UpdateAwaitingDispatchMutationVariables = {
      id: this.order.id,
      awaiting_dispatch: !this.order.awatingDispatch
    }
    await this.try(() => ordersApi.updateAwaitingDispatch(payload))
    await this.loadOrder(this.order.id)
  }

  async updateNeedAttention() {
    this.assertOrderExists()
    const payload: gql.UpdateNeedAttentionMutationVariables = {
      id: this.order.id,
      need_attention: this.order.needAttention ? 'false' : 'true'
    }
    await this.try(() => ordersApi.updateNeedAttention(payload))
    await this.loadOrder(this.order.id)
  }

  private assertOrderExists(): asserts this is { order: Order } {
    if (!this.order) {
      throw new Error('Order not found')
    }
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
