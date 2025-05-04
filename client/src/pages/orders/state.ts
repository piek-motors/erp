import { ChangeEvent } from 'react'
import { OrderStatus } from 'shared'
import { create } from 'zustand'

interface IOrderListPageStore {
  managerId: number
  orderStatusId: OrderStatus
  searchTerm: string

  orderTypeFilterHandler(e: any): void
  searchInputHandler(e: ChangeEvent<HTMLInputElement>): void
  managerFilterHandler(userId: number): void
}

export const useOrderListPageStore = create<IOrderListPageStore>(set => ({
  managerId: 0,
  orderStatusId: OrderStatus.ordArchived,
  searchTerm: '',
  orderTypeFilterHandler(e) {
    set({ orderStatusId: e.target.value as unknown as OrderStatus })
  },
  managerFilterHandler(userId) {
    set({ managerId: userId })
  },

  searchInputHandler(e) {
    set({ searchTerm: e.target.value })
  }
}))
