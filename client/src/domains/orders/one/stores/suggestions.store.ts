import { apolloClient } from 'lib/api/apollo-client'
import { rpc } from 'lib/rpc.client'
import * as gql from 'lib/types/graphql-shema'
import { makeAutoObservable } from 'mobx'
import { User, UserRole } from 'models'

export class SuggestionsStore {
  constructor() {
    makeAutoObservable(this)
  }
  async init() {
    return await Promise.all([
      this.getManagers(),
      this.getCities(),
      this.getContractors()
    ])
  }

  managers: User[] = []
  cities: string[] = []
  contractors: string[] = []

  private setCities(cities: string[]) {
    this.cities = cities
  }
  private setContractors(contractors: string[]) {
    this.contractors = contractors
  }
  private setManagers(managers: User[]) {
    this.managers = managers
  }
  async getCities() {
    const res = await apolloClient.query<
      gql.GetDistinctCitiesQuery,
      gql.GetDistinctCitiesQueryVariables
    >({
      query: gql.GetDistinctCitiesDocument,
      fetchPolicy: 'cache-first'
    })
    const cities = res.data.orders_orders
      .map(order => order.city)
      .filter(Boolean) as string[]
    if (cities) {
      this.setCities(cities)
    }
  }
  async getContractors() {
    const res = await apolloClient.query<
      gql.GetDistinctContractorsQuery,
      gql.GetDistinctContractorsQueryVariables
    >({
      query: gql.GetDistinctContractorsDocument,
      fetchPolicy: 'cache-first'
    })
    const contractors = res.data.orders_orders
      .map(order => order.contractor)
      .filter(Boolean) as string[]
    if (contractors) {
      this.setContractors(contractors)
    }
  }

  async getManagers() {
    const res = await rpc.userList.query({
      role: UserRole.OrderManager
    })
    const orderManagers = res.map(
      user =>
        new User(user.id, user.role, user.first_name!, user.last_name, null)
    )
    this.setManagers(orderManagers)
  }
}

export const suggestionsStore = new SuggestionsStore()
