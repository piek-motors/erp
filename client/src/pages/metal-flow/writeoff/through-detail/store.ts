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
  setQty(v: number) {
    this.qty = v
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
