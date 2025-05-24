import { Order, OrderAttachment, OrderItem, Payment, User } from 'domain-model'
import {
  GetAllUsersQuery,
  GetOrderAttachmentsQuery,
  OrderFragment
} from 'types/graphql-shema'

class OrderMapper {
  fromDto(dto: OrderFragment): Order {
    console.log(dto)
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
      manager: new User({
        email: '',
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
    doc: GetOrderAttachmentsQuery['orders_attachments'][number]
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
  fromDto(dto: GetAllUsersQuery['users'][number]): User {
    return new User({
      id: dto.id,
      firstName: dto.first_name!,
      lastName: dto.last_name!
    })
  }
}

export const map = {
  order: new OrderMapper(),
  user: new UserMapper()
}
