import { makeAutoObservable } from 'mobx'

export class MaterialCost {
  materialId!: number
  setMaterialId(materialId: number) {
    this.materialId = materialId
  }
  length!: string
  setLength(length: string) {
    this.length = length
  }
  constructor(init: { material_id?: number; length?: string | number } = {}) {
    this.materialId = init.material_id || 0
    this.length = init.length?.toString() ?? ''
    makeAutoObservable(this)
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
}
