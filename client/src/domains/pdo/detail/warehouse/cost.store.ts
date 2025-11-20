import { cache } from 'domains/pdo/cache/root'
import { makeAutoObservable } from 'mobx'
import { DetailAutomaticWriteoffData } from 'srv/rpc/pdo/detail/get'

export class MaterialCost {
  materialId!: number
  setMaterialId(materialId: number) {
    this.materialId = materialId
  }
  length!: string
  setLength(length: string) {
    this.length = length
  }
  constructor(init?: DetailAutomaticWriteoffData['material']) {
    if (init) {
      if (init[0]) {
        this.materialId = init[0]
      }
      if (init[1]) {
        this.length = init[1].toString()
      }
    }
    makeAutoObservable(this)
  }
  get material() {
    return cache.materials.get(this.materialId)
  }
}

export class DetailCost {
  detailId: number
  setDetailId(id: number) {
    this.detailId = id
  }
  qty: string
  setQty(qty: string) {
    this.qty = qty
  }
  constructor(init: { detail_id?: number; qty?: string | number } = {}) {
    makeAutoObservable(this)
    this.detailId = init.detail_id || 0
    this.qty = init.qty?.toString() || '1'
  }
  get detail() {
    return cache.details.get(this.detailId)
  }
}
