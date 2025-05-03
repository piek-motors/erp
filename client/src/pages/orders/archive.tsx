import { Sheet, Typography } from '@mui/joy'
import moment from 'moment'
import { useMemo } from 'react'
import { ManagerFilter } from 'src/components'
import { OrderTypeFilter } from 'src/components/order-type-filter'
import { Search } from 'src/components/search-input'
import { TableName } from 'src/components/table-name'
import { useFilter } from 'src/hooks'
import { AppRoutes } from 'src/lib/routes'
import { NavTabs } from 'src/pages/orders/tabs'
import { RouteConfig } from 'src/types/global'
import { useGetOrdersArchivedBySearchKeywordQuery } from 'src/types/graphql-shema'
import { columnsList } from './columns'
import { Table } from './shared/table'
import { useOrderListPageStore } from './state'
import { t } from './text'

function Archive() {
  const columns = useMemo(() => {
    const a = [...columnsList]
    a[3] = {
      Header: 'Факт отгрузка',
      accessor: order => (
        <>
          {order.ActualShippingDate &&
            moment(order.ActualShippingDate).format('DD.MM.YY')}
        </>
      )
    }
    return a
  }, [])

  const store = useOrderListPageStore()

  const keyword = () => {
    if (!store.searchTerm) return ''
    if (store.searchTerm === '/all') return '%%'
    else return '%' + store.searchTerm + '%'
  }

  const { data } = useGetOrdersArchivedBySearchKeywordQuery({
    variables: {
      keyword: keyword(),
      OrderStatus: store.orderStatusId
      // ManagerID: 0
    }
  })

  const orders = useFilter({
    orders: data?.erp_Orders || [],
    options: {
      managerId: store.managerId,
      orderStatusId: store.orderStatusId
    }
  })

  return (
    <>
      <NavTabs />
      <Sheet>
        <Search
          value={store.searchTerm}
          onChange={store.searchInputHandler}
          placeholder={t.InputPlaceholder}
        >
          <ManagerFilter
            value={store.managerId}
            onChange={store.managerFilterHandler}
          />
          <OrderTypeFilter
            value={store.orderStatusId}
            onChange={store.orderTypeFilterHandler}
          />
        </Search>

        <TableName name="Результат поиска по архиву" />
        {orders && <Table columns={columns} data={orders} showUnpaid />}
        {!orders.length && (
          <Typography m={2}>(ノ#-_-)ノ ничего не найдено</Typography>
        )}
      </Sheet>
    </>
  )
}

export default [
  {
    element: <Archive />,
    path: AppRoutes.orders_archive
  }
] as RouteConfig[]
