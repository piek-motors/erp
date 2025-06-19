import { User } from 'domain-model'
import { apolloClient } from 'lib/api/apollo-client'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'
import { map } from '../../order.mappers'

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
    const res = await apolloClient.query<
      gql.GetManagersQuery,
      gql.GetManagersQueryVariables
    >({
      query: gql.GetManagersDocument,
      fetchPolicy: 'cache-first'
    })
    const users_d = res.data.users.map(user => map.user.fromDto(user))
    if (users_d) {
      this.setManagers(users_d)
    }
  }
}

export const suggestionsStore = new SuggestionsStore()
