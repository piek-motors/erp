import { makeAutoObservable } from 'mobx'
import { app_cache } from '@/domains/pdo/cache'
import { MaterialSupplySt } from './supply_st'
import { MaterialWriteoffSt } from './writeoff_st'

export class MaterialWarehouseStore {
  readonly supply = new MaterialSupplySt()
  readonly writeoff = new MaterialWriteoffSt()

  on_hand_balance: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  async insertSupply(materialId: number) {
    const on_hand_balance = await this.supply.insertSupply(materialId)
    this.reset()
    this.on_hand_balance = on_hand_balance
    return on_hand_balance
  }

  async insertWriteoff(materialId: number) {
    const on_hand_balance = await this.writeoff.insertWriteoff(materialId)
    this.reset()
    this.on_hand_balance = on_hand_balance
    return on_hand_balance
  }

  private reset() {
    this.supply.reset()
    this.writeoff.reset()
    app_cache.materials.invalidate()
    this.on_hand_balance = 0
  }
}
