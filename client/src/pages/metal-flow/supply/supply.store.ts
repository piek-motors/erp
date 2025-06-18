import { Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { SupplyDto } from './columns.decl'
import * as api from './supply.api'

class SupplyStore {
  supplies: SupplyDto[] = []

  material: Material | null = null
  qty: string = ''

  selectMaterialDialogOpen = false

  setSelectMaterialDialogOpen(open: boolean) {
    this.selectMaterialDialogOpen = open
  }

  constructor() {
    makeAutoObservable(this)
  }

  setMaterial(material: Material) {
    this.material = material
  }

  setQty(qty: string) {
    this.qty = qty
  }

  async deleteSupply(id: number) {
    await api.deleteSupply(id)

    this.supplies = this.supplies.filter(supply => supply.id !== id)
    return id
  }

  reset() {
    this.material = null
    this.qty = ''
  }

  async load() {
    const res = await api.getSupplies()
    this.supplies = res
  }

  async insertSupply() {
    const materialId = this.material?.id
    const qty = this.qty
    if (!materialId) throw Error('Материал не выбран')
    if (!qty) throw Error('Количество не указано')
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
