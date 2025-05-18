import { TOrderItem } from 'types/global'
import { create } from 'zustand'

interface IOrderDetailState {
  addOrderItemDialog: boolean
  editedOrderItem: TOrderItem | null
  orderId: number | null
  initialize(orderId: number): void
  setAddOrderItemDialog(value: boolean): void
  setEditedOrderItem(value: TOrderItem | null): void
}

export const useOrderDetailStore = create<IOrderDetailState>(set => ({
  // initial state
  orderId: null,
  addOrderItemDialog: false,
  editedOrderItem: null,
  // methods for manipulating state
  initialize(orderId: number) {
    set(() => ({
      orderId,
      addOrderItemDialog: false
    }))
  },
  setEditedOrderItem(value: TOrderItem | null) {
    set(() => ({
      editedOrderItem: value,
      addOrderItemDialog: true
    }))
  },
  setAddOrderItemDialog(value) {
    set(() => ({
      addOrderItemDialog: value
    }))
  }
}))
