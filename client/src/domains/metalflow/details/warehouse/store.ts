import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { EnSupplyReason, EnWriteoffReason } from 'models'

class Supply {
  constructor() {
    makeAutoObservable(this)
  }
  reason: EnSupplyReason = EnSupplyReason.FromSupplier
  setReason(reason: EnSupplyReason) {
    this.reason = reason
  }
}

class Writeoff {
  constructor() {
    makeAutoObservable(this)
  }
  reason: EnWriteoffReason = EnWriteoffReason.UsedInProduction
  setReason(reason: EnWriteoffReason) {
    this.reason = reason
  }
}

export class DetailWarehouseStore {
  constructor() {
    makeAutoObservable(this)
  }
  supply = new Supply()
  writeoff = new Writeoff()
  qty = 0
  setQty(qty: number) {
    this.qty = qty
  }
  clear() {
    this.qty = 0
  }
  async insertSupply(detailId: number) {
    await rpc.metal.details.supply.mutate({
      detailId,
      qty: this.qty,
      reason: this.supply.reason
    })
    this.clear()
  }
  async insertWriteoff(detailId: number) {
    await rpc.metal.details.writeoff.mutate({
      detailId,
      qty: this.qty,
      reason: this.writeoff.reason
    })
    this.clear()
  }
}
