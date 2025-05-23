import { Order, OrderStatus } from 'domain-model'
import { TOrder, TReclamationOrder } from 'types/global'

export function orderStatus(order: Order) {
  // add a note to the title if this is a pre-order
  if (order.statusID === OrderStatus.ordRegistration) return ' Предзаказ'
  if (order.statusID === OrderStatus.ordArchived) return ' В архиве'
  if (
    [
      OrderStatus.reclInbox,
      OrderStatus.reclDecision,
      OrderStatus.reclProduction,
      OrderStatus.reclArchived
    ].includes(order.statusID)
  )
    return ' Рекламация'

  if (order.statusID === OrderStatus.ordProduction) return ' В производстве'
}

export function orderStatusHighlighting(order: TOrder | TReclamationOrder) {
  // Выделение заказов требующих внимания имеют приоритет
  if (order.NeedAttention?.split(',')[0] === 'true') return 'needAttention'
  else if (order.AwaitingDispatch) return 'awaitingDispatch'
  else return ''
}
