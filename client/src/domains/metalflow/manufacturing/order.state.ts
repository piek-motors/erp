import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'
import { DetailState } from '../detail/detail.state'

export type ManufacturingOrderOutput =
  RouterOutput['metal']['manufacturing']['get']

export class OrderState {
  readonly async = new AsyncStoreController()
  order: ManufacturingOrderOutput | null = null
  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
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
