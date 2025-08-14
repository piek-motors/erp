import { makeAutoObservable } from 'mobx'
import { DetailAutomaticWriteoffData } from 'srv/procedures/metalflow/detail/get'
import { DetailCost, MaterialCost } from './cost.store'

export class DetailAutomaticWriteoffStore {
  detailsCost: DetailCost[] = []
  setDetailCost(details?: DetailCost[]) {
    this.detailsCost = details || []
  }
  materialsCost: MaterialCost[] = []
  setMaterialCost(materials?: MaterialCost[]) {
    this.materialsCost = materials || []
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(init: DetailAutomaticWriteoffData) {
    this.setDetailCost(init.details.map(d => new DetailCost(d)))
    this.setMaterialCost(init.materials.map(m => new MaterialCost(m)))
  }

  get payload(): DetailAutomaticWriteoffData {
    return {
      details: this.detailsCost.map(d => ({
        detail_id: d.detailId,
        qty: +d.qty
      })),
      materials: this.materialsCost.map(m => ({
        material_id: m.materialId,
        length: +m.length
      }))
    }
  }

  reset() {
    this.detailsCost = []
    this.materialsCost = []
  }

  insertMaterialCost() {
    this.materialsCost.push(new MaterialCost())
  }

  insertDetail() {
    this.detailsCost.push(new DetailCost())
  }

  updateMaterial(index: number, materialId: number, length: string) {
    const m = this.materialsCost[index]
    if (!m) {
      this.insertMaterialCost()
      return
    }
    m.materialId = materialId
    m.length = length
  }

  updateDetail(index: number, detailId: number, qty: string) {
    const d = this.detailsCost[index]
    if (!d) {
      this.insertDetail()
      return
    }
  }

  async deleteMaterial(materialId: number) {
    this.setMaterialCost(
      this.materialsCost.filter(m => m.materialId !== materialId)
    )
  }

  async deleteDetail(detailId: number) {
    this.setDetailCost(this.detailsCost.filter(d => d.detailId !== detailId))
  }
}
