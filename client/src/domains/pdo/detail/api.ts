import { LoadingController } from 'lib/loading_controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Attachment } from 'models'
import { cache } from '../cache/root'
import { DetailState } from './detail.state'

export class DetailApi {
  readonly loader = new LoadingController()
  constructor() {
    makeAutoObservable(this)
  }

  async loadFull(detailId: number) {
    return this.loader.run(async () => {
      const detail = new DetailState()
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

  async loadShort(detailId: number) {
    const res = await rpc.pdo.details.getShort.query({ id: detailId })
    const detail = new DetailState()
    detail.init(res)
    return detail
  }

  async delete(id: number) {
    await rpc.pdo.details.delete.mutate({ id })
    cache.details.removeDetail(id)
  }

  async createManufacturingOrder(id: number) {
    return rpc.pdo.manufacturing.create.mutate({
      detailId: id
    })
  }

  async insert(detail: DetailState) {
    const payload = detail.createPayload()
    const res = await rpc.pdo.details.create.mutate(payload)
    await cache.details.load()
    return res.id
  }

  async update(detail: DetailState) {
    const payload = detail.createPayload()
    await rpc.pdo.details.update.mutate(payload)
    await cache.details.load()
    detail.setUpdatedAt(new Date())
    return detail
  }

  reset() {
    this.loader.reset()
  }
}

export const api = new DetailApi()
