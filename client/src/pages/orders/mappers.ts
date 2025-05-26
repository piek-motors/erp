import { Order, OrderAttachment, OrderItem, Payment, User } from 'domain-model'
import * as gql from 'types/graphql-shema'

class OrderMapper {
  fromDto(dto: gql.OrderFragment): Order {
    return new Order({
      id: dto.id,
      shippingDate: dto.shipping_date,
      totalAmount: dto.total_amount,
      payments: dto.order_payments.map(
        payment =>
          new Payment({
            id: payment.id,
            amount: payment.amount,
            date: payment.date
          })
      ),
      contractor: dto.contractor,
      city: dto.city,
      awatingDispatch: dto.awaiting_dispatch,
      needAttention: dto.need_attention === 'true',
      invoiceNumber: dto.invoice_number,
      factoryNumber: dto.order_number,
      manager: new User({
        id: dto.user?.id,
        email: dto.user?.email ?? '',
        firstName: dto.user?.first_name!,
        lastName: dto.user?.last_name!
      }),
      items: dto.order_items.map(
        item =>
          new OrderItem({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            description: item.description
          })
      ),
      documents: [],
      createdAt: dto.created_at,
      acceptanceDate: dto.acceptance_date,
      actualShippingDate: dto.actual_shipping_date,
      comment: dto.comment,
      status: dto.status
    })
  }

  docsFromDto(
    doc: gql.GetOrderAttachmentsQuery['orders_attachments'][number]
  ): OrderAttachment {
    return new OrderAttachment({
      id: doc.id,
      name: doc.filename ?? '',
      key: doc.key ?? '',
      size: doc.size
    })
  }
}

class UserMapper {
  fromDto(dto: gql.GetAllUsersQuery['users'][number]): User {
    return new User({
      id: dto.id,
      firstName: dto.first_name!,
      lastName: dto.last_name!,
      role: dto.role
    })
  }
}

class OrderItemMapper {
  fromDto(
    dto: gql.GetOrderPositionsQuery['orders_order_items'][number]
  ): OrderItem {
    return new OrderItem({
      id: dto.id,
      name: dto.name,
      quantity: dto.quantity,
      description: dto.description
    })
  }
}

export const map = {
  order: new OrderMapper(),
  user: new UserMapper(),
  orderItem: new OrderItemMapper()
}
