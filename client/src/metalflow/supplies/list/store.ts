import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { MaterialListOutput } from '../../materials/list/store'
import { SupplyDto } from '../columns.decl'

class SupplyListStore {
  supplies: SupplyDto[] = []
  material: MaterialListOutput | null = null
  qty: string = ''
  selectMaterialDialogOpen = false
  setSelectMaterialDialogOpen(open: boolean) {
    this.selectMaterialDialogOpen = open
  }
  constructor() {
    makeAutoObservable(this)
  }
  setMaterial(material: MaterialListOutput) {
    this.material = material
  }
  setQty(qty: string) {
    this.qty = qty
  }
  async deleteSupply(id: number) {
    await rpc.material.deleteSupply.mutate({ id })
    this.supplies = this.supplies.filter(supply => supply.id !== id)
    return id
  }
  reset() {
    this.material = null
    this.qty = ''
  }
  async load() {
    const res = await rpc.material.listSupply.query()
    console.log(res)
    this.supplies = res
  }
  async insertSupply() {
    const materialId = this.material?.id
    const qty = this.qty
    if (!materialId) throw Error('Материал не выбран')
    if (!qty) throw Error('Количество не указано')
    this.reset()
    return await rpc.material.supply.mutate({
      material_id: materialId,
      qty: Number(qty)
    })
  }
}
export const supplyStore = new SupplyListStore()
