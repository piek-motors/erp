import { EnWriteoffReason, EnWriteoffType } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { DetailWriteoffStore } from '../details/writeoff/store'
import { MaterialWriteoffState } from '../materials/writeoff/state'
import { WriteoffListStore } from './list/store'
class WriteoffStore {
  private listStore = new WriteoffListStore()
  throughDetail = new DetailWriteoffStore()
  throughMaterial = new MaterialWriteoffState()
  constructor() {
    makeAutoObservable(this)
  }
  type: EnWriteoffType = EnWriteoffType.ThroughDetail
  setType(v: EnWriteoffType) {
    this.type = v
  }
  reason: EnWriteoffReason = EnWriteoffReason.Production
  setReason(v: EnWriteoffReason) {
    this.reason = v
  }
  reset() {
    this.reason = EnWriteoffReason.Production
  }
  validate() {
    if (this.type === EnWriteoffType.ThroughDetail) {
      return this.throughDetail.validate()
    } else if (this.type === EnWriteoffType.ThroughMaterial) {
      return this.throughMaterial.validate()
    }
  }
  async init() {
    const writeoffs = await rpc.material.listWriteoff.query()
    this.listStore.set(writeoffs)
  }
  async insert() {
    this.validate()
    if (this.type === EnWriteoffType.ThroughDetail) {
      return this.throughDetail.save(this.reason)
    } else if (this.type === EnWriteoffType.ThroughMaterial) {
      return this.throughMaterial.save(this.reason)
    }
    throw new Error(`Unknown type: ${this.type}`)
  }
  async delete(id: number) {
    await rpc.material.deleteWriteoff.mutate({ id })
    this.listStore.delete(id)
  }
  get writeoffs() {
    return this.listStore.writeoffs
  }
}
export const writeoffStore = new WriteoffStore()
