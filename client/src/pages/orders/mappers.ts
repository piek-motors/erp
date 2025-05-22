import { Order, OrderItem, Payment, User } from 'domain-model'
import { OrderFragment } from 'types/graphql-shema'

class OrderMapper {
  fromDto(dto: OrderFragment): Order {
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
      items: dto.OrderItems.map(
        item =>
          new OrderItem({
            id: item.OrderItemID,
            name: item.Name,
            quantity: item.Quantity
          })
      )
    })
  }
}

export const map = {
  order: new OrderMapper()
}
