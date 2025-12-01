import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { SupplyReason, WriteoffReason } from 'models'

class Supply {
  constructor() {
    makeAutoObservable(this)
  }
  reason: SupplyReason = SupplyReason.FromSupplier
  setReason(reason: SupplyReason) {
    this.reason = reason
  }
}

class Writeoff {
  constructor() {
    makeAutoObservable(this)
  }
  reason: WriteoffReason = WriteoffReason.UsedInProduction
  setReason(reason: WriteoffReason) {
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
    const stock = await rpc.pdo.details.writeoff.mutate({
      detailId,
      qty: this.qty,
      reason: this.writeoff.reason
    })
    this.clear()
    this.setStock(stock)
    return stock
  }
}
