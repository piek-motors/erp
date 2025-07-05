import { EnSupplyReason } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'

export class MaterialSupplyStore {
  qty: string = ''
  setQty(qty: string) {
    this.qty = qty
  }
  length: string = ''
  setLength(length: string, linearMass: string) {
    this.length = length
    this.qty = (Number(length) * Number(linearMass)).toFixed(3)
  }
  reason: EnSupplyReason = EnSupplyReason.FromSupplier
  setReason(reason: EnSupplyReason) {
    this.reason = reason
  }
  constructor() {
    makeAutoObservable(this)
  }
  reset() {
    this.qty = ''
    this.reason = EnSupplyReason.FromSupplier
  }
  disabled() {
    return this.qty === '' || this.reason == null
  }
  async insertSupply(materialId?: number): Promise<number> {
    if (!materialId) throw Error('Материал не выбран')
    if (this.reason == null) throw Error('Причина не указана')

    const qty = this.qty
    if (!qty) throw Error('Количество не указано')

    const res = await rpc.material.supply.mutate({
      material_id: materialId,
      qty: Number(qty),
      reason: this.reason
    })
    this.reset()
    return Number(res.qty)
  }
}
