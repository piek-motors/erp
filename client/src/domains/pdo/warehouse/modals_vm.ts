import { makeAutoObservable } from 'mobx'

export class InventoryLogModalVM {
  constructor() {
    makeAutoObservable(this)
  }
  supply = false
  writeoff = false
  setSupply(open: boolean) {
    this.supply = open
  }
  setWriteoff(open: boolean) {
    this.writeoff = open
  }
}

export const inventory_log_modal = new InventoryLogModalVM()
