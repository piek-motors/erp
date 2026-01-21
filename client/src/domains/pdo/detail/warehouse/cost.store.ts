import { cache } from 'domains/pdo/cache/root'
import { makeAutoObservable } from 'mobx'
import { DetailAutomaticWriteoffData } from 'srv/rpc/pdo/details'

export class MaterialCost {
  materialId!: number
  setMaterialId(materialId: number) {
    this.materialId = materialId
  }
  length?: number
  setLength(length?: number) {
    this.length = length
  }
  constructor(init?: DetailAutomaticWriteoffData['material']) {
    if (init) {
      if (init[0]) {
        this.materialId = init[0]
      }
      if (init[1]) {
        this.length = init[1]
      }
    }
    makeAutoObservable(this)
  }
  get material() {
    return cache.materials.get(this.materialId)
  }
  getCost(): [number, number] {
    if (!this.length) {
      throw Error(`Не указан расход для материала ${this.material?.label}`)
    }
    return [this.materialId, this.length]
  }
}

export class DetailCost {
  detailId: number
  setDetailId(id: number) {
    this.detailId = id
  }
  qty?: number = 1
  setQty(qty?: number) {
    this.qty = qty
  }
  constructor(init: { detail_id?: number; qty?: number } = {}) {
    makeAutoObservable(this)
    this.detailId = init.detail_id || 0
    this.qty = init.qty || 1
  }
  get detail() {
    return cache.details.get(this.detailId)
  }
}
