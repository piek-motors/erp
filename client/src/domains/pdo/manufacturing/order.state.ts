import { LoadingController } from 'lib/loading_controller'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'
import { DetailState } from '../detail/detail.state'

export type ManufacturingOrderOutput =
  RouterOutput['pdo']['manufacturing']['get']

type OrderAlreadyInProductionModal = {
  manufacturingId: number
  detailId: number
  qty: number
} | null

export class ManufacturingOrderState {
  readonly async = new LoadingController()
  order: ManufacturingOrderOutput | null = null

  orderAlreadyInProductionModal: OrderAlreadyInProductionModal = null
  setOrderAlreadyInProductionModal(modal: OrderAlreadyInProductionModal) {
    this.orderAlreadyInProductionModal = modal
  }

  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
    this.qty = order.qty.toString()
  }
  detail!: DetailState
  setDetail(detail: DetailState) {
    this.detail = detail
  }
  qty: string = ''
  setQty(qty: string) {
    this.qty = qty
  }
  constructor() {
    makeAutoObservable(this)
  }
}
