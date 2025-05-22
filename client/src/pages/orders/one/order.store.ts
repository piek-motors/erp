import { makeAutoObservable } from 'mobx'

export class OrderStore {
  constructor() {
    makeAutoObservable(this)
  }

  editMode = false
  switchEditMode() {
    this.editMode = !this.editMode
  }
}

export const orderStore = new OrderStore()
