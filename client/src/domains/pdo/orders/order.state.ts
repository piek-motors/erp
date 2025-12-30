import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

export type ManufacturingOrderOutput =
  RouterOutput['pdo']['manufacturing']['get']

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
    this.currentOperation = order.current_operation
    this.orderAlreadyInProductionModal = null
  }

  qty?: number
  setQty(qty: number) {
    this.qty = qty
  }

  currentOperation: number | null = null
  setCurrentOperationIndex(index: number | null) {
    this.currentOperation = index
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
