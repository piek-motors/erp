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
      id: dto.OrderID,
      shippingDate: dto.ShippingDate,
      totalAmount: dto.TotalAmount,
      payments: dto.PaymentHistories.map(
        payment =>
          new Payment({
            id: payment.ID,
            amount: payment.PaidAmount,
            date: payment.Date
          })
      ),
      contractor: dto.Entity,
      city: dto.City,
      awatingDispatch: dto.AwaitingDispatch,
      needAttention: dto.NeedAttention === 'true',
      invoiceNumber: dto.InvoiceNumber,
      manager: new User({
        email: '',
        firstName: dto.User?.FirstName!,
        lastName: dto.User?.LastName
      }),
      items: dto.OrderItems?.map(
        item =>
          new OrderItem({
            id: item.OrderItemID,
            name: item.Name,
            quantity: item.Quantity
          })
      ),
      documents: [],
      createdAt: dto.CreatingDate,
      acceptanceDate: dto.AcceptanceDate,
      actualShippingDate: dto.ActualShippingDate,
      comment: dto.Comment,
      statusID: dto.OrderStatusID
    })
  }

  docsFromDto(
    doc: GetOrderAttachmentsQuery['erp_Docs'][number]
  ): OrderAttachment {
    return new OrderAttachment({
      id: doc.ID,
      name: doc.FileName ?? '',
      key: doc.Key ?? '',
      size: doc.Size
    })
  }
}

class UserMapper {
  fromDto(dto: GetAllUsersQuery['erp_Users'][number]): User {
    return new User({
      id: dto.UserID,
      firstName: dto.FirstName!,
      lastName: dto.LastName!
    })
  }
}

export const map = {
  order: new OrderMapper(),
  user: new UserMapper()
}
