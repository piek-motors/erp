import { OrderItem } from 'domain-model'
import { create } from 'zustand'

interface IOrderDetailState {
  addOrderItemDialog: boolean
  editedOrderItem: OrderItem | null
  orderId: number | null
  initialize(orderId: number): void
  setAddOrderItemDialog(value: boolean): void
  setEditedOrderItem(value: OrderItem | null): void
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
  setEditedOrderItem(value: OrderItem | null) {
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
