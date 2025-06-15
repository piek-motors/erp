import { EnWriteoffReason, EnWriteoffType, Writeoff } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'mobx'
import { WriteoffListStore } from './list/store'
import { WriteoffTroughDetailStore } from './through-detail/store'
import { WriteoffThroughMaterialStore } from './through-material/store'
import { WriteoffApi } from './writeoff.api'

class WriteoffStore {
  private api = new WriteoffApi()
  private async = new AsyncStoreController()

  listStore = new WriteoffListStore()
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
      const detail = this.throughDetail.detail
      if (!detail?.id) return false
      if (detail.materials.length === 0) return false
      if (this.throughDetail.qty === 0) return false
    } else if (this.type === EnWriteoffType.DirectUnit) {
      const material = this.throughMaterial.material?.id
      if (!material) return false
      if (this.throughMaterial.qty === 0) return false
    }

    return true
  }

  async insert() {
    this.validate()
    // TODO: use polymorphism
    if (this.type === EnWriteoffType.ThroughDetail) {
      const detail = this.throughDetail.detail
      if (!detail) {
        throw new Error('Detail is not set')
      }

      const writeoffs: Writeoff[] = []
      if (detail.materials.length === 0) {
        throw new Error('Detail has no materials')
      }

      for (const material of detail.materials) {
        const w = new Writeoff(
          0,
          new Date(),
          this.throughDetail.totalWeight,
          this.reason,
          material.material,
          this.type,
          this.throughDetail.getTypeData()
        )
        return await this.api.create(w)
      }
      return await this.api.createMany(writeoffs)
    } else if (this.type === EnWriteoffType.DirectUnit) {
      const material = this.throughMaterial.material
      if (!material) {
        throw new Error('Material is not set')
      }
      const w = new Writeoff(
        0,
        new Date(),
        this.throughMaterial.qty,
        this.reason,
        material,
        this.type,
        this.throughMaterial.getTypeData()
      )
      return await this.api.create(w)
    }
  }
}

export const writeoffStore = new WriteoffStore()
