import { makeAutoObservable } from 'mobx'
import type { SupplyReason, WriteoffReason } from 'shared'
import { rpc } from '@/lib/rpc/rpc.client'
import { app_cache } from '../../cache'

class Supply {
  constructor() {
    makeAutoObservable(this)
  }
  reason: SupplyReason | null = null
  setReason(reason: SupplyReason) {
    this.reason = reason
  }
}

class Writeoff {
  constructor() {
    makeAutoObservable(this)
  }
  reason: WriteoffReason | null = null
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
  qty: number | null = null
  setQty(qty: number | null) {
    this.qty = qty
  }

  stock = 0
  setStock(stock: number) {
    this.stock = stock
  }
  clear() {
    this.qty = null
  }

  async insertSupply(detailId: number) {
    if (!this.qty) throw Error('Кол-во не задано')

    const { reason } = this.supply
    if (reason == null) throw Error('Не задано основание поставки')

    const { stock } = await rpc.pdo.details.supply.mutate({
      detailId,
      qty: this.qty,
      reason,
    })
    this.update_stock(detailId, stock)
    return stock
  }

  async insertWriteoff(detailId: number) {
    if (!this.qty) throw Error('Кол-во не задано')

    const { reason } = this.writeoff
    if (reason == null) throw Error('Не задано основание списания')

    const stock = await rpc.pdo.details.writeoff.mutate({
      detailId,
      qty: this.qty,
      reason,
    })
    this.update_stock(detailId, stock)
    return stock
  }

  private update_stock(detailId: number, stock: number) {
    this.clear()
    this.setStock(stock)
    app_cache.details.update_on_hande_balance(detailId, stock)
  }
}
