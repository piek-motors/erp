import { LoadingController } from 'lib/loading_controller'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'
import { DetailState, Operation, ProcessingRoute } from '../detail/detail.state'

export type ManufacturingOrderOutput =
  RouterOutput['pdo']['manufacturing']['get']

export class ManufacturingOrderState {
  readonly async = new LoadingController()
  readonly processingRoute = new ProcessingRoute()
  order: ManufacturingOrderOutput | null = null
  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
    const steps = order.data?.processing_route?.steps.map(s => {
      const step = new Operation()
      step.name = s.name
      step.dur = s.dur
      step.executor_name = s.executor_name ?? ''
      return step
    })
    this.processingRoute.init(steps ?? [])
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
