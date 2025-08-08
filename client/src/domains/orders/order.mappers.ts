import * as gql from 'lib/types/graphql-shema'
import { Attachment, Order, OrderItem, Payment, User } from 'models'

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
      manager: new User(
        dto.user?.id!,
        null,
        dto.user?.first_name!,
        dto.user?.last_name ?? null,
        dto.user?.email ?? null
      ),
      items: dto.order_items.map(
        item =>
          new OrderItem({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            description: item.description
          })
      ),
      attachments: [],
      createdAt: dto.created_at,
      acceptanceDate: dto.acceptance_date,
      actualShippingDate: dto.actual_shipping_date,
      comment: dto.comment,
      status: dto.status
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

class AttachmentMapper {
  fromDto(
    doc: gql.GetOrderAttachmentsQuery['orders_order_attachments'][number]
  ): Attachment {
    return new Attachment(
      doc.attachment.id,
      doc.attachment.filename ?? '',
      doc.attachment.size,
      doc.attachment.key ?? ''
    )
  }
}

export const map = {
  order: new OrderMapper(),
  orderItem: new OrderItemMapper(),
  attachment: new AttachmentMapper()
}
