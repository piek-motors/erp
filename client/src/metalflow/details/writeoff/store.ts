import { EnWriteoffReason } from 'domain-model'
import { makeAutoObservable, rpc } from 'lib/deps'
import { cache } from 'metalflow/cache/root'
import { Detail } from '../detail.store'

export class DetailWriteoffStore {
  constructor() {
    makeAutoObservable(this)
  }
  detail?: Detail
  setDetail(v: Detail) {
    this.detail = v
  }
  reason: EnWriteoffReason = EnWriteoffReason.UsedInProduction
  setReason(v: EnWriteoffReason) {
    this.reason = v
  }
  qty: number = 0
  setQty(v: string) {
    const isNumber = Number.isFinite(parseInt(v))
    this.qty = isNumber ? Number(v) : 0
  }
  reset() {
    this.detail = undefined
    this.qty = 0
  }
  validate(): Error | undefined {
    const detail = this.detail?.id
    if (!detail) {
      return new Error('Деталь не выбрана')
    }
    if (!this.detail?.usedMaterials || this.detail.usedMaterials.length === 0) {
      return new Error('Не указан материал детали')
    }
    if (this.qty === 0) {
      return new Error('Количество не указано')
    }
  }
  async save(): Promise<number[]> {
    const detail = this.detail
    if (!detail?.id) {
      throw new Error('Detail is not set')
    }
    await rpc.metal.material.writeoffTroughDetail.mutate({
      detailId: detail.id,
      qty: this.qty,
      reason: this.reason
    })
    await cache.materials.load()
    return []
  }
}
