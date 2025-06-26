import { makeAutoObservable } from 'mobx'

export class ManufacturingStore {
  constructor() {
    makeAutoObservable(this)
  }
}
