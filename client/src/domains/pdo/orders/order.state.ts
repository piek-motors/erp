import { makeAutoObservable } from 'mobx'
import { OrderPriority } from 'models'
import { rpc } from '@/lib/deps'
import type { RouterOutput } from '@/server/lib/trpc'

export type ManufacturingOrderOutput = RouterOutput['pdo']['orders']['get']

type OrderAlreadyInProductionModal = {
  manufacturingId: number
  detailId: number
  qty: number
} | null

export type OrderStProp = { order: OrderSt }

export class OrderSt {
  constructor() {
    makeAutoObservable(this)
  }

  resp: ManufacturingOrderOutput | null = null
  isLoading(): boolean {
    return this.resp == null
  }

  orderAlreadyInProductionModal: OrderAlreadyInProductionModal = null
  setOrderAlreadyInProductionModal(modal: OrderAlreadyInProductionModal) {
    this.orderAlreadyInProductionModal = modal
  }

  setOrder(order: ManufacturingOrderOutput) {
    this.resp = order
    this.qty = order.qty
    this.outputQty = order.output_qty ?? null
    this.currentOperation = order.current_operation
    this.orderAlreadyInProductionModal = null
    this.priority = order.priority
  }

  qty: number | null = null
  setQty(qty: number) {
    this.qty = qty
  }
  outputQty: number | null = null
  setOutputQty(qty: number) {
    this.outputQty = qty
  }

  currentOperation: number | null = null
  setCurrentOperationIndex(index: number | null) {
    this.currentOperation = index
  }

  priority: OrderPriority = OrderPriority.Normal
  async set_priority(priority: OrderPriority) {
    this.priority = priority
    await rpc.pdo.orders_mut.set_priority.mutate({ id: this.id, priority })
  }

  get id() {
    if (!this.resp?.id) {
      throw new Error('Manufacturing order id not set')
    }
    return this.resp.id
  }

  get status() {
    if (this.resp?.status == null) {
      throw new Error('Manufacturing order status is not set')
    }
    return this.resp.status
  }
}
