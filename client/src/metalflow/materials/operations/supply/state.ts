import { EnSupplyReason } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'

export class MaterialSupplyStore {
  length: string = ''
  setLength(length: string) {
    this.length = length
  }
  reason: EnSupplyReason = EnSupplyReason.FromSupplier
  setReason(reason: EnSupplyReason) {
    this.reason = reason
  }
  constructor() {
    makeAutoObservable(this)
  }
  reset() {
    this.length = ''
  }
  disabled() {
    return this.length === '' || this.reason == null
  }
  async insertSupply(materialId?: number): Promise<number> {
    if (!materialId) throw Error('Материал не выбран')
    if (this.reason == null) throw Error('Причина не указана')

    const length = this.length
    if (!length) throw Error('Длина не указана')

    const res = await rpc.metal.material.supply.mutate({
      material_id: materialId,
      lengthMeters: Number(length),
      reason: this.reason
    })
    this.reset()
    return Number(res.qty)
  }
}
