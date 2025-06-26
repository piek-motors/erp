import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
export class MaterialSupplyStore {
  qty: string = ''
  setQty(qty: string) {
    this.qty = qty
  }
  constructor() {
    makeAutoObservable(this)
  }
  reset() {
    this.qty = ''
  }
  async insertSupply(materialId?: number) {
    if (!materialId) throw Error('Материал не выбран')

    const qty = this.qty
    if (!qty) throw Error('Количество не указано')
    this.reset()
    return await rpc.material.supply.mutate({
      material_id: materialId,
      qty: Number(qty)
    })
  }
}
