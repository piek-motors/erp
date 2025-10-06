import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { notifier } from 'lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { map } from '../mappers'
import { ManufacturingOrderState } from './order.state'

export class ManufacturingApi {
  readonly status = new AsyncStoreController()
  readonly s = new ManufacturingOrderState()
  constructor() {
    makeAutoObservable(this)
  }

  async load(id: number) {
    this.status.run(async () => {
      const order = await rpc.metal.manufacturing.get.query({ id })
      this.s.setOrder(order)
      // Load detail materials if we have a detail_id
      if (order.detail_id) {
        const { detail } = await rpc.metal.details.get.query({
          id: order.detail_id
        })
        this.s.setDetail(
          map.detail.fromDto({
            ...detail,
            updated_at: detail.updated_at
              ? new Date(detail.updated_at)
              : undefined
          })
        )
      }
    })
  }

  async startMaterialPreparationPhase() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.startMaterialPreparationPhase.mutate({
        orderId: this.s.order.id
      })
      await this.load(this.s.order.id)
    })
  }

  async save() {
    if (!this.s.order) throw new Error('Заказ не найден')
    return rpc.metal.manufacturing.update.mutate({
      orderId: this.s.order.id,
      processingRoute: this.s.processingRoute,
      qty: parseInt(this.s.qty)
    })
  }

  async startProductionPhase() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      if (!this.s.qty) throw new Error('Кол-во не может быть 0')
      const writeoffs =
        await rpc.metal.manufacturing.startProductionPhase.mutate({
          orderId: this.s.order.id,
          qty: parseInt(this.s.qty)
        })
      await this.load(this.s.order.id)
      for (const writeoff of writeoffs) {
        notifier.notify(
          'info',
          `Списано ${writeoff.totalCost} м ${writeoff.material_name}, остаток ${writeoff.stock} м`
        )
      }
    })
  }

  async finish() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.finish.mutate({ id: this.s.order.id })
      await this.load(this.s.order.id)
    })
  }

  async delete() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.delete.mutate({ id: this.s.order.id })
    })
  }
}

export const api = new ManufacturingApi()
