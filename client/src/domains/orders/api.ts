import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { OrderStatus } from 'models'
import { RouterInput } from 'srv/lib/trpc'
import { ClientOrder, OrderPosition } from 'srv/rpc/orders/orders_router'

export type UnpackedOrder = Omit<ClientOrder, 'positions'> & {
  positions: OrderPosition[]
}

export class OrdersApi {
  constructor() {
    makeAutoObservable(this)
  }

  async loadOrders(
    status: OrderStatus,
    ordering?: RouterInput['orders']['list']['ordering']
  ): Promise<UnpackedOrder[]> {
    const matrix = await rpc.orders.list.query({ status, ordering })
    const orders = matrixDecoder<ClientOrder>(matrix)
    return orders.map(order => ({
      ...order,
      positions: matrixDecoder<OrderPosition>(order.positions)
    }))
  }

  async searchArchived(
    keyword: string,
    status: OrderStatus
  ): Promise<UnpackedOrder[]> {
    const matrix = await rpc.orders.search_archived.query({
      keyword,
      order_status: status
    })
    const orders = matrixDecoder<ClientOrder>(matrix)
    return orders.map(order => ({
      ...order,
      positions: matrixDecoder<OrderPosition>(order.positions)
    }))
  }
}

export const ordersApi = new OrdersApi()
