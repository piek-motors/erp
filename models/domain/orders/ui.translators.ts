import { OrderStatus } from './enums'

export const UiOrderStatus = {
	[OrderStatus.PreOrder]: 'Предзаказ',
	[OrderStatus.InProduction]: 'В производстве',
	[OrderStatus.Archived]: 'В архиве',
	[OrderStatus.ReclamationIncoming]: 'Входящие',
	[OrderStatus.ReclamationDecision]: 'Принятие решения',
	[OrderStatus.ReclamationInProduction]: 'В производстве',
	[OrderStatus.ReclamationArchived]: 'В архиве',
}

export function uiOrderStatus(status: OrderStatus) {
	return UiOrderStatus[status]
}
