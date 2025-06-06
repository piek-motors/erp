import { apolloClient } from 'lib/api'
import { map } from 'pages/orders/mappers'
import * as gql from 'types/graphql-shema'

export class AttachmentsApi {
  static async load(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderAttachmentsQuery,
      gql.GetOrderAttachmentsQueryVariables
    >({
      query: gql.GetOrderAttachmentsDocument,
      variables: {
        order_id: orderId
      }
    })
    if (res.errors) {
      throw new Error(res.errors.toString())
    }
    return res.data.orders_attachments.map(map.attachment.fromDto)
  }
}
