import { rpc } from 'lib/rpc.client'
import { MaterialLiseOutput } from 'metalflow/material/store/material-list.store'
import { makeAutoObservable } from 'mobx'
import { SupplyDto } from './columns.decl'

class SupplyStore {
  supplies: SupplyDto[] = []

  material: MaterialLiseOutput | null = null
  qty: string = ''

  selectMaterialDialogOpen = false

  setSelectMaterialDialogOpen(open: boolean) {
    this.selectMaterialDialogOpen = open
  }

  constructor() {
    makeAutoObservable(this)
  }

  setMaterial(material: MaterialLiseOutput) {
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

export const supplyStore = new SupplyStore()
