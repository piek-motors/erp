import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { User } from 'models'

export class SuggestionsStore {
  constructor() {
    makeAutoObservable(this)
  }
  managers: User[] = []
  setManagers(managers: User[]) {
    this.managers = managers
  }
  cities: string[] = []
  setCities(cities: string[]) {
    this.cities = cities
  }
  contractors: string[] = []
  setContractors(contractors: string[]) {
    this.contractors = contractors
  }
  async init() {
    const res = await rpc.orders.suggestions.query()
    this.setCities(res.cities)
    this.setContractors(res.contractors)
    this.setManagers(
      res.managers.map(
        user =>
          new User(user.id, user.role, user.first_name!, user.last_name, null)
      )
    )
  }
}

export const suggestionsStore = new SuggestionsStore()
