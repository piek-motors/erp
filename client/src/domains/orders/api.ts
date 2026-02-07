import { makeAutoObservable } from 'mobx'
import type { OrderStatus } from 'models'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import type {
  ClientOrder,
  OrderPosition,
} from '@/server/domains/orders/orders_rpc'
import type { RouterInput } from '@/server/lib/trpc'

export type UnpackedOrder = Omit<ClientOrder, 'positions'> & {
  positions: OrderPosition[]
}

export class OrdersApi {
  constructor() {
    makeAutoObservable(this)
  }

  async loadOrders(
    status: OrderStatus,
    ordering?: RouterInput['orders']['list']['ordering'],
  ): Promise<UnpackedOrder[]> {
    const matrix = await rpc.orders.list.query({ status, ordering })
    const orders = matrixDecoder<ClientOrder>(matrix)
    return orders.map(order => ({
      ...order,
      positions: matrixDecoder<OrderPosition>(order.positions),
    }))
  }

  async searchArchived(
    keyword: string,
    status: OrderStatus,
  ): Promise<UnpackedOrder[]> {
    const matrix = await rpc.orders.search_archived.query({
      keyword,
      order_status: status,
    })
    const orders = matrixDecoder<ClientOrder>(matrix)
    return orders.map(order => ({
      ...order,
      positions: matrixDecoder<OrderPosition>(order.positions),
    }))
  }
}

export const ordersApi = new OrdersApi()
