import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { notifierStore } from 'lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

export type ManufacturingOrderOutput =
  RouterOutput['metal']['manufacturing']['get']

export type DetailMaterialOutput =
  RouterOutput['metal']['details']['get']['detail_materials'][0]

export class ManufacturingOrderStore {
  readonly async = new AsyncStoreController()

  order: ManufacturingOrderOutput | null = null
  setOrder(order: ManufacturingOrderOutput) {
    this.order = order
  }

  detailMaterials: DetailMaterialOutput[] = []
  setDetailMaterials(materials: DetailMaterialOutput[]) {
    this.detailMaterials = materials
  }

  qty: string = ''
  setQty(qty: string) {
    this.qty = qty
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load(id: number) {
    this.async.run(async () => {
      const order = await rpc.metal.manufacturing.get.query({ id })
      this.setOrder(order)

      // Load detail materials if we have a detail_id
      if (order.detail_id) {
        const detailInfo = await rpc.metal.details.get.query({
          id: order.detail_id
        })
        this.setDetailMaterials(detailInfo.detail_materials)
      }
    })
  }

  async startMaterialPreparationPhase() {
    await this.async.run(async () => {
      if (!this.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.startMaterialPreparationPhase.mutate({
        orderId: this.order.id
      })
      await this.load(this.order.id)
    })
  }

  async startProductionPhase() {
    await this.async.run(async () => {
      if (!this.order) throw new Error('Заказ не найден')
      if (!this.qty) throw new Error('Кол-во не может быть 0')
      const writeoffs =
        await rpc.metal.manufacturing.startProductionPhase.mutate({
          orderId: this.order.id,
          qty: parseInt(this.qty)
        })
      await this.load(this.order.id)
      for (const writeoff of writeoffs) {
        notifierStore.notify(
          'info',
          `Списано ${writeoff.totalCost} м ${writeoff.material_name}, остаток ${writeoff.stock} м`
        )
      }
    })
  }

  async finish() {
    await this.async.run(async () => {
      if (!this.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.finish.mutate({ id: this.order.id })
      await this.load(this.order.id)
    })
  }

  async delete() {
    await this.async.run(async () => {
      if (!this.order) throw new Error('Заказ не найден')
      await rpc.metal.manufacturing.delete.mutate({ id: this.order.id })
    })
  }
}

export const store = new ManufacturingOrderStore()
