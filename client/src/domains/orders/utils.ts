import { UnpackedOrder } from './api'

export const getBackgroundColor = (order: UnpackedOrder): string => {
  if (order.need_attention) return '#f5b9b9ba'
  if (order.awaiting_dispatch) return '#cae9b4a3'
  return ''
}
