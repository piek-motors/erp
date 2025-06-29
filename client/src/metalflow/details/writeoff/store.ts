import { EnWriteoffReason, WriteoffTroughDetail } from 'domain-model'
import { makeAutoObservable, rpc } from 'lib/deps'
import { Detail } from '../detail.store'

export class DetailWriteoffStore {
  constructor() {
    makeAutoObservable(this)
  }
  dialogOpen = false
  setDialogOpen(v: boolean) {
    this.dialogOpen = v
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
  get totalWeight() {
    if (!this.detail) {
      throw new Error('Detail is not set')
    }
    let totalWeight = 0
    for (const material of this.detail.usedMaterials) {
      totalWeight += Number(material.weight) * this.qty
    }
    return totalWeight
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
  getTypeData(): WriteoffTroughDetail {
    if (!this.detail?.id) {
      throw new Error('Detail is not set')
    }
    return {
      detailId: this.detail.id,
      qty: this.qty
    }
  }
  async save(): Promise<number[]> {
    const detail = this.detail
    if (!detail?.id) {
      throw new Error('Detail is not set')
    }
    await rpc.material.writeoffTroughDetail.mutate({
      detailId: detail.id,
      qty: this.qty,
      reason: this.reason
    })
    return []
  }
}
