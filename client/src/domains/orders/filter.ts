import type { OrderStatus } from 'models'
import keywordComparator from '../../lib/utils/comparators'
import type { UnpackedOrder } from './api'

interface UseApplyFiltersProps {
	orders: UnpackedOrder[]
	options: Options
}

type Options = {
	managerId?: any
	searchKeyword?: any
	orderStatusId?: OrderStatus
}

type FilterHandler = {
	[key: string]: (order: UnpackedOrder) => boolean
}

export function useFilter({ orders, options }: UseApplyFiltersProps) {
	const { managerId, searchKeyword, orderStatusId } = options

	const handlers: FilterHandler = {
		byStatus: order => {
			if (!orderStatusId) return true

			const isSuit = order.status === orderStatusId
			return isSuit
		},
		byManager: order => {
			if (!managerId) return true

			const isSuit = order.manager_id === managerId
			return isSuit
		},
		bySearch: order => {
			if (!searchKeyword) return true

			const isSuit = keywordComparator(
				searchKeyword,
				order.invoice_number?.toString() ?? '',
				order.contractor ?? '',
			)
			return isSuit
		},
	}

	const handleOrders = (orders: UnpackedOrder[]) => {
		return orders?.filter(order =>
			Object.values(handlers).every(handle => handle(order)),
		)
	}

	return handleOrders(orders)
}
