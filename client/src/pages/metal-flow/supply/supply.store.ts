import { Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { SupplyDto } from './columns.decl'
import * as api from './supply.api'

class SupplyStore {
  supplies: SupplyDto[] = []

  material: Material | null = null
  qty: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  setMaterial(material: Material) {
    this.material = material
  }

  setQty(qty: number) {
    this.qty = qty
  }

  async deleteSupply(id: number) {
    await api.deleteSupply(id)

    this.supplies = this.supplies.filter(supply => supply.id !== id)
    return id
  }

  reset() {
    this.material = null
    this.qty = 0
  }

  async load() {
    const res = await api.getSupplies()
    this.supplies = res
  }

  async insertSupply(materialId: number, qty: number) {
    this.reset()

    return await api.insertSupply({
      object: {
        material_id: materialId,
        qty,
        supplied_at: new Date(),
        supplier_name: ''
      }
    })
  }
}

export const supplyStore = new SupplyStore()
