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
  readonly supply = new Supply()
  readonly writeoff = new Writeoff()
  constructor() {
    makeAutoObservable(this)
  }
  qty = 0
  setQty(qty: number) {
    this.qty = qty
  }
  stock = 0
  setStock(stock: number) {
    this.stock = stock
  }
  clear() {
    this.qty = 0
  }

  async insertSupply(detailId: number) {
    const res = await rpc.pdo.details.supply.mutate({
      detailId,
      qty: this.qty,
      reason: this.supply.reason
    })
    this.clear()
    this.setStock(res.stock)
    return res.stock
  }
  async insertWriteoff(detailId: number) {
    const res = await rpc.pdo.details.writeoff.mutate({
      detailId,
      qty: this.qty,
      reason: this.writeoff.reason
    })
    this.clear()
    this.setStock(res.stock)
    return res.stock
  }
}
