import { DetailApi } from 'domains/metalflow/detail/api'
import { DetailState } from 'domains/metalflow/detail/detail.state'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'

export class FinishModalStore {
  open = false
  setOpen(v: boolean) {
    this.open = v
  }

  detail: DetailState
  setDetail(detail: DetailState) {
    this.detail = detail
  }

  constructor() {
    makeAutoObservable(this)
    this.detail = new DetailState()
  }

  async finishManufacturing() {
    await rpc.metal.manufacturing.finish.mutate({ id: this.detail.id! })
    this.setOpen(false)
  }

  async init() {
    const crud = new DetailApi()
    await crud.loadFull(this.detail.id!)
    this.setDetail(crud.detail)
  }
}

export const finishModalStore = new FinishModalStore()
