import { apolloClient } from 'api'
import * as gql from 'types/graphql-shema'
import { map } from './mappers'

class _OrdersApi {
  async getOrder(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderByPkQuery,
      gql.GetOrderByPkQueryVariables
    >({
      query: gql.GetOrderByPkDocument,
      variables: { id: orderId }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return map.order.fromDto(res.data?.orders_orders[0])
  }

  async insertOrder(variables: gql.InsertOrderMutationVariables) {
    const res = await apolloClient.mutate<
      gql.InsertOrderMutation,
      gql.InsertOrderMutationVariables
    >({
      mutation: gql.InsertOrderDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    if (!res.data?.insert_orders_orders_one?.id) {
      throw new Error('Failed to insert order')
    }
    return res.data.insert_orders_orders_one.id
  }

  async updateOrder(variables: gql.UpdateOrderInfoMutationVariables) {
    const res = await apolloClient.mutate<
      gql.UpdateOrderInfoMutation,
      gql.UpdateOrderInfoMutationVariables
    >({
      mutation: gql.UpdateOrderInfoDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_orders_by_pk?.id
  }

  async deleteOrder(variables: gql.DeleteOrderMutationVariables) {
    const res = await apolloClient.mutate<
      gql.DeleteOrderMutation,
      gql.DeleteOrderMutationVariables
    >({
      mutation: gql.DeleteOrderDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.delete_orders_orders_by_pk?.id
  }

  async moveToArchive(variables: gql.MoveOrderToArchiveMutationVariables) {
    const res = await apolloClient.mutate<
      gql.MoveOrderToArchiveMutation,
      gql.MoveOrderToArchiveMutationVariables
    >({
      mutation: gql.MoveOrderToArchiveDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_orders_by_pk?.id
  }

  async moveToPriority(variables: gql.MoveOrderToPriorityMutationVariables) {
    const res = await apolloClient.mutate<
      gql.MoveOrderToPriorityMutation,
      gql.MoveOrderToPriorityMutationVariables
    >({
      mutation: gql.MoveOrderToPriorityDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_orders_by_pk?.id
  }

  async updateAwaitingDispatch(
    variables: gql.UpdateAwaitingDispatchMutationVariables
  ) {
    const res = await apolloClient.mutate<
      gql.UpdateAwaitingDispatchMutation,
      gql.UpdateAwaitingDispatchMutationVariables
    >({
      mutation: gql.UpdateAwaitingDispatchDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_orders_by_pk?.id
  }

  async updateNeedAttention(
    variables: gql.UpdateNeedAttentionMutationVariables
  ) {
    const res = await apolloClient.mutate<
      gql.UpdateNeedAttentionMutation,
      gql.UpdateNeedAttentionMutationVariables
    >({
      mutation: gql.UpdateNeedAttentionDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_orders_by_pk?.id
  }

  async loadOrderItems(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderPositionsQuery,
      gql.GetOrderPositionsQueryVariables
    >({
      query: gql.GetOrderPositionsDocument,
      variables: { order_id: orderId }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.orders_order_items.map(map.orderItem.fromDto)
  }

  async insertOrderItem(variables: gql.InsertOrderItemMutationVariables) {
    const res = await apolloClient.mutate<
      gql.InsertOrderItemMutation,
      gql.InsertOrderItemMutationVariables
    >({
      mutation: gql.InsertOrderItemDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.insert_orders_order_items_one?.id
  }

  async updateOrderItem(variables: gql.UpdateOrderItemByPkMutationVariables) {
    const res = await apolloClient.mutate<
      gql.UpdateOrderItemByPkMutation,
      gql.UpdateOrderItemByPkMutationVariables
    >({
      mutation: gql.UpdateOrderItemByPkDocument,
      variables
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.update_orders_order_items_by_pk?.id
  }

  async deleteOrderItem(orderItemId: number) {
    const res = await apolloClient.mutate<
      gql.DeleteOrderItemByPkMutation,
      gql.DeleteOrderItemByPkMutationVariables
    >({
      mutation: gql.DeleteOrderItemByPkDocument,
      variables: { id: orderItemId }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data?.delete_orders_order_items_by_pk?.id
  }
}

export const ordersApi = new _OrdersApi()
