import { makeAutoObservable } from 'mobx'
import { OrderStatus } from 'models'
import { ChangeEvent } from 'react'

export class OrderListPageStore {
  managerId: number = 0
  setManagerId(userId: number) {
    this.managerId = userId
  }

  orderStatusId: OrderStatus = OrderStatus.Archived
  setOrderStatusId(status: OrderStatus) {
    this.orderStatusId = status
  }

  searchTerm: string = ''
  setSearchTerm(term: string) {
    this.searchTerm = term
  }

  constructor() {
    makeAutoObservable(this)
  }

  orderTypeFilterHandler(v: OrderStatus) {
    this.orderStatusId = v
  }

  searchInputHandler(e: ChangeEvent<HTMLInputElement>) {
    this.searchTerm = e.target.value
  }

  managerFilterHandler(userId: number) {
    this.managerId = userId
  }
}

export const orderListPageStore = new OrderListPageStore()
