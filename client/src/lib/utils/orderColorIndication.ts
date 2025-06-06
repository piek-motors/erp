import { Order, OrderStatus } from 'domain-model'
import { TOrder, TReclamationOrder } from 'types/global'

export function orderStatus(order: Order) {
  // add a note to the title if this is a pre-order
  if (order.status === OrderStatus.PreOrder) return ' Предзаказ'
  if (order.status === OrderStatus.Archived) return ' В архиве'
  if (
    [
      OrderStatus.ReclamationIncoming,
      OrderStatus.ReclamationDecision,
      OrderStatus.ReclamationInProduction,
      OrderStatus.ReclamationArchived
    ].includes(order.status)
  )
    return ' Рекламация'

  if (order.status === OrderStatus.InProduction) return ' В производстве'
}

export function orderStatusHighlighting(order: TOrder | TReclamationOrder) {
  // Выделение заказов требующих внимания имеют приоритет
  if (order.need_attention) return 'needAttention'
  else if (order.awaiting_dispatch) return 'awaitingDispatch'
  else return ''
}
