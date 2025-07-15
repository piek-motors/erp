import { rpc } from 'lib/rpc.client'
import { Detail } from 'metalflow/details/detail.store'
import { makeAutoObservable } from 'mobx'

export class FinishModalStore {
  open = false
  setOpen(v: boolean) {
    this.open = v
  }

  detail: Detail
  constructor() {
    makeAutoObservable(this)
    this.detail = new Detail()
  }

  async loadDetail(id: number) {
    return this.detail.load(id)
  }

  async finishManufacturing() {
    await rpc.metal.manufacturing.finish.mutate({ id: this.detail.id! })
    this.setOpen(false)
  }
}

export const finishModalStore = new FinishModalStore()
