import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { SupplyReason } from 'models'

export class MaterialSupplySt {
  length: string = ''
  setLength(length: string) {
    this.length = length
  }
  reason: SupplyReason = SupplyReason.FromSupplier
  setReason(reason: SupplyReason) {
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

    const { qty } = await rpc.pdo.material.supply.mutate({
      material_id: materialId,
      lengthMeters: Number(length),
      reason: this.reason,
    })
    this.reset()
    return Number(qty)
  }
}
