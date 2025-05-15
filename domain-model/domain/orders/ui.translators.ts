import { OrderStatus } from './enums'

export const UiOrderStatus = {
  [OrderStatus.ordRegistration]: 'Предзаказ',
  [OrderStatus.ordProduction]: 'В производстве',
  [OrderStatus.ordArchived]: 'В архиве',
  [OrderStatus.reclInbox]: 'Входящие',
  [OrderStatus.reclDecision]: 'Принятие решения',
  [OrderStatus.reclProduction]: 'В производстве',
  [OrderStatus.reclArchived]: 'В архиве'
}

export function uiOrderStatus(status: OrderStatus) {
  return UiOrderStatus[status]
}
