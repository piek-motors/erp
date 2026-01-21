import { rpc } from 'lib/rpc/rpc.client'
import { LoadingController } from 'lib/store/loading_controller'
import { notifier } from 'lib/store/notifier.store'
import { makeAutoObservable } from 'mobx'
import { Attachment } from 'models'
import { cache } from '../cache/root'
import { DetailSt } from './detail.state'
import { detailListStore } from './list/store'

export class DetailApi {
  readonly loader = new LoadingController()
  constructor() {
    makeAutoObservable(this)
  }

  async get(detailId: number) {
    return this.loader.run(async () => {
      const detail = new DetailSt()
      const res = await rpc.pdo.details.get.query({ id: detailId })
      detail.init(res.detail)
      detail.setLastManufacturingDate(
        res.last_manufacturing?.date
          ? new Date(res.last_manufacturing.date)
          : undefined
      )
      detail.setLastManufacturingQty(res.last_manufacturing?.qty)
      detail.attachments.setFiles(
        res.attachments.map(
          a =>
            new Attachment(
              a.id ?? 0,
              a.filename ?? '',
              a.size ?? 0,
              a.key ?? ''
            )
        )
      )
      return detail
    })
  }

  async delete(id: number) {
    await rpc.pdo.details.delete.mutate({ id })
    cache.details.remove(id)
    detailListStore.searchStore.search()
  }

  async createManufacturingOrder(id: number) {
    return rpc.pdo.orders_mut.create.mutate({
      detailId: id
    })
  }

  async insert(detail: DetailSt) {
    const res = await rpc.pdo.details.create.mutate(detail.payload())
    await cache.details.load()
    return res.id
  }

  async update(detail: DetailSt) {
    try {
      await rpc.pdo.details.update.mutate(detail.payload())
      cache.details.update(detail)
      detail.setUpdatedAt(new Date())
      notifier.ok(`Деталь обновлена`)
      return detail
    } catch (e: any) {
      notifier.err(e.message)
      throw e
    }
  }

  reset() {
    this.loader.reset()
  }
}

export const api = new DetailApi()
