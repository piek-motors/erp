import { TOrderColumnData } from 'src/types/global'
import styles from './table.module.sass'

export function statusHighlighting(order: TOrderColumnData) {
  // if (showUnpaid && order.unpaid) return styles.unpaidOrder
  // Выделение заказов требующих внимания имеют приоритет
  if (order.NeedAttention?.split(',')[0] === 'true') return styles.needAttention
  else if (order.AwaitingDispatch) return styles.awaitingDispatch
  else return ''
}
