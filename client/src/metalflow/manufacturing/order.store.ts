import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../server/src/lib/trpc'

export type ManufacturingOrderOutput =
  RouterOutput['metal']['manufacturing']['get']

export class ManufacturingOrderStore {
  readonly async = new AsyncStoreController()

  order: ManufacturingOrderOutput | null = null
  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
  }

  qty: number = 0
  setQty(qty: number) {
    this.qty = qty
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load(id: number) {
    this.async.run(async () => {
      const order = await rpc.metal.manufacturing.get.query({ id })
      this.setOrder(order)
    })
  }

  async startMaterialPreparation() {
    if (!this.order) return
    await rpc.metal.manufacturing.startMaterialPreparationPhase.mutate({
      orderId: this.order.id
    })
    await this.load(this.order.id)
  }

  async startProduction() {
    if (!this.order) return
    if (this.qty === 0) {
      this.async.setError(new Error('Кол-во не может быть 0'))
      return
    }
    await rpc.metal.manufacturing.startProductionPhase.mutate({
      orderId: this.order.id,
      qty: this.qty
    })
    await this.load(this.order.id)
  }

  async finish() {
    if (!this.order) return
    await rpc.metal.manufacturing.finish.mutate({ id: this.order.id })
    await this.load(this.order.id)
  }

  async delete() {
    if (!this.order) return
    await rpc.metal.manufacturing.delete.mutate({ id: this.order.id })
  }
}

export const store = new ManufacturingOrderStore()
