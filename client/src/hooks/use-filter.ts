import { TOrderColumnData } from 'lib/types/global'
import { OrderStatus } from '../../../domain-model/dist'
import keywordComparator from '../lib/utils/comparators'

interface UseApplyFiltersProps {
  orders: TOrderColumnData[]
  options: Options
}

type Options = {
  managerId?: any
  searchKeyword?: any
  orderStatusId?: OrderStatus
}

type FilterHandler = {
  [key: string]: (order: TOrderColumnData) => boolean
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
        order.contractor ?? ''
      )
      return isSuit
    }
  }

  const handleOrders = (orders: TOrderColumnData[]) => {
    return orders?.filter(order =>
      Object.values(handlers).every(handle => handle(order))
    )
  }

  return handleOrders(orders)
}
