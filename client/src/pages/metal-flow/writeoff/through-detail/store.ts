import { Detail, WriteoffTroughDetail } from 'domain-model'
import { makeAutoObservable } from 'lib/deps'
import { IWriteoffType } from '../interfaces/writeoff-type'

export class WriteoffTroughDetailStore implements IWriteoffType {
  constructor() {
    makeAutoObservable(this)
  }

  detail?: Detail
  setDetail(v: Detail) {
    this.detail = v
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
    for (const material of this.detail.materials) {
      totalWeight += material.weight * this.qty
    }

    return totalWeight
  }

  validate(): Error | undefined {
    const detail = this.detail?.id
    if (!detail) {
      return new Error('Деталь не выбрана')
    }
    if (!this.detail?.materials || this.detail.materials.length === 0) {
      return new Error('Не указан материал детали')
    }

    if (this.qty === 0) {
      return new Error('Количество не указано')
    }
  }

  getTypeData(): WriteoffTroughDetail {
    if (!this.detail) {
      throw new Error('Detail is not set')
    }
    return {
      detailId: this.detail.id,
      qty: this.qty
    }
  }
}
