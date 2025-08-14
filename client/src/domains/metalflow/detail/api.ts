import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Attachment } from 'models'
import { cache } from '../cache/root'
import { DetailState } from './detail.state'

export class DetailApi {
  readonly status = new AsyncStoreController()
  readonly detail = new DetailState()
  constructor() {
    makeAutoObservable(this)
  }

  async loadFull(detailId: number) {
    return this.status.run(async () => {
      const res = await rpc.metal.details.get.query({ id: detailId })
      this.detail.init(res.detail)
      this.detail.setLastManufacturingDate(
        res.last_manufacturing?.date
          ? new Date(res.last_manufacturing.date)
          : undefined
      )
      this.detail.setLastManufacturingQty(res.last_manufacturing?.qty)
      this.detail.attachments.setFiles(
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
    })
  }

  async loadShort(detailId: number) {
    const res = await rpc.metal.details.getShort.query({ id: detailId })
    this.detail.init(res)
  }

  async delete() {
    const id = this.detail.id
    if (!id) throw new Error('Detail id is not set')
    await rpc.metal.details.delete.mutate({ id })
    cache.details.removeDetail(id)
    this.detail.reset()
  }

  async createManufacturingOrder() {
    const id = this.detail.id
    if (!id) throw new Error('Detail id is not set')
    return rpc.metal.manufacturing.create.mutate({
      detailId: id
    })
  }

  async insert() {
    const payload = this.detail.createPayload()
    const res = await rpc.metal.details.create.mutate(payload)
    await cache.details.load()
    return res
  }

  async update() {
    const payload = this.detail.createPayload()
    const res = await rpc.metal.details.update.mutate(payload)
    await cache.details.load()
    this.detail.setUpdatedAt(new Date())
    return res
  }
}

export const api = new DetailApi()
