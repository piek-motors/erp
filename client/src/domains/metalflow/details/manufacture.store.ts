import { makeAutoObservable } from 'mobx'

export class DetailManufactureStore {
  qty = 0
  setQty = (qty: number) => {
    this.qty = qty
  }

  constructor() {
    makeAutoObservable(this)
  }

  async save() {
    console.log(this.qty)
  }
}

export const detailManufactureStore = new DetailManufactureStore()
