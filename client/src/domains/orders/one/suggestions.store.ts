import { rpc } from 'lib/rpc/rpc.client'
import { User } from 'lib/store/auth.store'
import { makeAutoObservable } from 'mobx'

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
          new User(user.id, user.roles, user.first_name!, user.last_name, null),
      ),
    )
  }
}

export const suggestionsStore = new SuggestionsStore()
