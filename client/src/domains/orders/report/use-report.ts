import { useFilter } from 'hooks'
import { useGetOrdersArchivedByIntervalQuery } from 'lib/types/graphql-shema'
import moment from 'moment'
import { orderListPageStore as store } from '../stores/state'

export function useReport() {
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
    orders: ordersCurrentMounth?.orders_orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })

  const ordersAccountingMonthFiltered = useFilter({
    orders: ordersAccountingMonth?.orders_orders || [],
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
