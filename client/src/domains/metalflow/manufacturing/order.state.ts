import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'
import { DetailState, ProcessingRoute, Step } from '../detail/detail.state'

export type ManufacturingOrderOutput =
  RouterOutput['metal']['manufacturing']['get']

export class OrderState {
  readonly async = new AsyncStoreController()
  readonly processingRoute = new ProcessingRoute()
  order: ManufacturingOrderOutput | null = null
  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
    const steps = order.data?.processing_route?.steps.map(s => {
      const step = new Step()
      step.name = s.name
      step.dur = s.dur
      step.executor_name = s.executor_name ?? ''
      step.date = s.date ?? ''
      return step
    })
    this.processingRoute.init(steps ?? [])
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
