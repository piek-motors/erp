import moment from 'moment'
import { useFilter } from 'src/hooks'
import { useGetOrdersArchivedByIntervalQuery } from 'src/types/graphql-shema'
import { useOrderListPageStore } from '../state'

export default function useReport() {
  const store: any = useOrderListPageStore()

  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm')
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm')

  const prevStartOfMonth = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYY-MM-DD HH:mm')
  const prevEndOfMonth = moment()
    .subtract(1, 'months')
    .endOf('month')
    .format('YYYY-MM-DD HH:mm')

  const { data: ordersCurrentMounth } = useGetOrdersArchivedByIntervalQuery({
    variables: {
      _gte: startOfMonth,
      _lte: endOfMonth
    }
  })

  const { data: ordersAccountingMonth } = useGetOrdersArchivedByIntervalQuery({
    variables: {
      _gte: prevStartOfMonth,
      _lte: prevEndOfMonth
    }
  })

  const ordersCurrentMonthFiltered = useFilter({
    orders: ordersCurrentMounth?.erp_Orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })

  const ordersAccountingMonthFiltered = useFilter({
    orders: ordersAccountingMonth?.erp_Orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })

  return {
    data: {
      loading: !Boolean(
        ordersAccountingMonthFiltered && ordersCurrentMonthFiltered
      ),
      ordersCurrentMonth: ordersCurrentMonthFiltered,
      ordersAccountingMonth: ordersAccountingMonthFiltered
    }
  }
}
