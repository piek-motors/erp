import { LoadingController } from 'lib/loading_controller'
import { rpc } from 'lib/rpc.client'
import { notifier } from 'lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { DetailApi } from '../detail/api'
import { DetailState } from '../detail/detail.state'
import {
  ManufacturingOrderOutput,
  ManufacturingOrderState
} from './order.state'

export class ManufacturingApi {
  readonly status = new LoadingController()
  readonly s = new ManufacturingOrderState()
  readonly detailApi = new DetailApi()
  constructor() {
    makeAutoObservable(this)
  }

  async load(
    id: number
  ): Promise<{ detail: DetailState; order: ManufacturingOrderOutput }> {
    return this.status.run(async () => {
      const order = await rpc.pdo.manufacturing.get.query({ id })
      this.s.setOrder(order)
      this.s.setOrderAlreadyInProductionModal(null)
      // Load detail materials if we have a detail_id
      if (!order.detail_id) {
        throw new Error('Заказ не содержит детали')
      }

      const detail = await this.detailApi.loadFull(order.detail_id)
      return { detail, order }
    })
  }

  async startMaterialPreparationPhase() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      await rpc.pdo.manufacturing.startMaterialPreparationPhase.mutate({
        orderId: this.s.order.id
      })
      await this.load(this.s.order.id)
    })
  }

  async save() {
    if (!this.s.order) throw new Error('Заказ не найден')
    return rpc.pdo.manufacturing.update.mutate({
      orderId: this.s.order.id,
      qty: parseInt(this.s.qty)
    })
  }

  async startProductionPhase(force?: boolean) {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      if (!this.s.qty) throw new Error('Кол-во не может быть 0')
      try {
        const writeoff =
          await rpc.pdo.manufacturing.startProductionPhase.mutate({
            orderId: this.s.order.id,
            qty: parseInt(this.s.qty),
            force
          })
        await this.load(this.s.order.id)
        if (writeoff) {
          notifier.notify(
            'info',
            `Списано ${writeoff.totalCost} м ${writeoff.material_name}, остаток ${writeoff.stock} м`
          )
        }
      } catch (e: any) {
        if (
          e.data?.code === 'CONFLICT' &&
          e.message.includes('Order already in production')
        ) {
          const manufacturingId = parseInt(e.message.split('order_id=')[1])
          const detailId = parseInt(e.message.split('detail_id=')[1])
          const qty = parseInt(e.message.split('qty=')[1])
          if (manufacturingId == null || detailId == null || qty == null) {
            throw new Error(
              `Failed to parse order id or detail id ${e.message}`
            )
          }
          this.s.setOrderAlreadyInProductionModal({
            manufacturingId,
            detailId,
            qty
          })
          return
        }
        throw e
      }
    })
  }

  async finish() {
    await this.status.run(async () => {
      if (!this.s.order) throw new Error('Заказ не найден')
      await rpc.pdo.manufacturing.finish.mutate({ id: this.s.order.id })
      await this.load(this.s.order.id)
    })
  }

  delete(id: ManufacturingOrderOutput['id']) {
    return rpc.pdo.manufacturing.delete.mutate({ id })
  }
}

export const api = new ManufacturingApi()
