import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { uiUnit } from 'models'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { DetailApi } from '../detail/detail_api'
import type { ManufacturingOrderOutput, OrderSt } from './order.state'

export class OrderApi {
  readonly loader = new LoadingController()
  readonly detailApi = new DetailApi()
  constructor() {
    makeAutoObservable(this)
  }

  async load(
    id: number,
  ): Promise<{ detail: DetailSt; order: ManufacturingOrderOutput }> {
    return this.loader.run(async () => {
      const order = await rpc.pdo.orders.get.query({ id })
      const detail = await this.detailApi.get(order.detail_id)
      return { detail, order }
    })
  }

  async reload(orderSt: OrderSt) {
    const { order } = await this.load(orderSt.id)
    orderSt.setOrder(order)
  }

  async startPreparation(order: OrderSt) {
    await this.loader.run(async () => {
      await rpc.pdo.orders_mut.start_preparation.mutate({
        orderId: order.id,
      })
      await this.reload(order)
    })
  }

  async startProduction(order: OrderSt, force?: boolean) {
    await this.loader.run(async () => {
      try {
        const writeoff = await rpc.pdo.orders_mut.start_production.mutate({
          orderId: order.id,
          qty: order.qty!,
          force,
        })
        await this.reload(order)
        if (writeoff) {
          const material = app_cache.materials.get_or_throw(
            writeoff.material_id,
          )
          const unitStr = uiUnit(material.unit)
          notifier.ok(
            `Списано ${writeoff.totalCost} ${unitStr} ${writeoff.material_name}`,
            10,
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
              `Failed to parse order id or detail id ${e.message}`,
            )
          }
          order.setOrderAlreadyInProductionModal({
            manufacturingId,
            detailId,
            qty,
          })
          return
        }
        throw e
      }
    })
  }

  async setCurrentOperation(order: OrderSt, index: number) {
    if (!order.resp) throw new Error('Заказ не найден')
    order.setCurrentOperationIndex(index)
    await rpc.pdo.orders_mut.set_current_operation.mutate({
      id: order.id,
      operation_index: index,
    })
    order.resp.current_operation_start_at = null
  }

  async set_qty(order: OrderSt, qty: number) {
    await this.loader.run(async () => {
      await rpc.pdo.orders_mut.update_qty.mutate({
        id: order.id,
        qty,
      })
      await this.reload(order)
    })
  }

  async finish(order: OrderSt) {
    await this.loader.run(async () => {
      await rpc.pdo.orders_mut.finish.mutate({ id: order.id })
      await this.reload(order)
    })
  }

  async returnToProduction(order: OrderSt) {
    await this.loader.run(async () => {
      await rpc.pdo.orders_mut.return_to_production.mutate({
        id: order.id,
      })
      await this.reload(order)
    })
  }

  delete(id: ManufacturingOrderOutput['id']) {
    return rpc.pdo.orders_mut.delete.mutate({ id })
  }
}

export const api = new OrderApi()
