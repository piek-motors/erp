import { EnWriteoffReason, EnWriteoffType, Writeoff } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { WriteoffListStore } from './list_writeoff/store'
import { WriteoffTroughDetailStore } from './through_detail/store'
import { WriteoffThroughMaterialStore } from './through_material/store'

class WriteoffStore {
  private listStore = new WriteoffListStore()

  throughDetail = new WriteoffTroughDetailStore()
  throughMaterial = new WriteoffThroughMaterialStore()

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

    this.listStore.set(
      writeoffs.map(e => {
        const w = new Writeoff()
        w.id = e.id
        w.date = new Date(e.date)
        w.qty = e.qty
        w.reason = e.reason
        w.material = {
          unit: e.unit,
          id: e.material_id,
          label: e.label
        }
        w.type = e.type
        w.typeData = e.type_data
        return w
      })
    )
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
