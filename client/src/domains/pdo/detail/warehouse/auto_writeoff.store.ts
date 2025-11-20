import { makeAutoObservable } from 'mobx'
import { DetailAutomaticWriteoffData } from 'srv/rpc/pdo/detail/get'
import { DetailCost, MaterialCost } from './cost.store'

export class DetailAutomaticWriteoffStore {
  detailsCost: DetailCost[] = []
  setDetailCost(detailCosts?: DetailCost[]) {
    this.detailsCost = detailCosts || []
  }
  materialCost: MaterialCost | null = null
  setMaterialCost(material?: MaterialCost | null) {
    this.materialCost = material || null
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(writeoffData: DetailAutomaticWriteoffData) {
    this.setDetailCost(writeoffData.details.map(d => new DetailCost(d)))
    this.setMaterialCost(
      writeoffData.material ? new MaterialCost(writeoffData.material) : null
    )
  }

  get payload(): DetailAutomaticWriteoffData {
    return {
      details: this.detailsCost.map(d => ({
        detail_id: d.detailId,
        qty: +d.qty
      })),
      material: this.materialCost
        ? [this.materialCost.materialId, +this.materialCost.length]
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

  deleteDetail(detailId: number) {
    this.setDetailCost(this.detailsCost.filter(d => d.detailId !== detailId))
  }
}
