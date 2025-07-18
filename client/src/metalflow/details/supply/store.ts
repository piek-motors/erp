import { makeAutoObservable } from 'lib/deps'

export class DetailSupplyStore {
  constructor() {
    makeAutoObservable(this)
  }
}
