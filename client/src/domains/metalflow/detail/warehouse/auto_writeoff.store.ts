import { makeAutoObservable } from 'mobx'
import { DetailAutomaticWriteoffData } from 'srv/procedures/metalflow/detail/get'
import { DetailCost, MaterialCost } from './cost.store'

export class DetailAutomaticWriteoffStore {
  detailsCost: DetailCost[] = []
  setDetailCost(details?: DetailCost[]) {
    this.detailsCost = details || []
  }
  materialCost: MaterialCost | null = null
  setMaterialCost(material?: MaterialCost | null) {
    this.materialCost = material || null
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(init: DetailAutomaticWriteoffData) {
    this.setDetailCost(init.details.map(d => new DetailCost(d)))
    this.setMaterialCost(init.material ? new MaterialCost(init.material) : null)
  }

  get payload(): DetailAutomaticWriteoffData {
    return {
      details: this.detailsCost.map(d => ({
        detail_id: d.detailId,
        qty: +d.qty
      })),
      material: this.materialCost
        ? {
            material_id: this.materialCost.materialId,
            length: +this.materialCost.length
          }
        : null
    }
  }

  reset() {
    this.detailsCost = []
    this.materialCost = null
  }

  insertMaterialCost() {
    this.materialCost = new MaterialCost()
  }

  insertDetail() {
    this.detailsCost.push(new DetailCost())
  }

  updateMaterial(materialId: number, length: string) {
    if (!this.materialCost) {
      this.insertMaterialCost()
    }
    if (this.materialCost) {
      this.materialCost.materialId = materialId
      this.materialCost.length = length
    }
  }

  updateDetail(index: number, detailId: number, qty: string) {
    const d = this.detailsCost[index]
    if (!d) {
      this.insertDetail()
      return
    }
  }

  async deleteDetail(detailId: number) {
    this.setDetailCost(this.detailsCost.filter(d => d.detailId !== detailId))
  }
}
