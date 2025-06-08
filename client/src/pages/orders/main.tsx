/** @jsxImportSource @emotion/react */
import { Box, Sheet, Stack } from '@mui/joy'
import { ManagerFilter, PageTitle, Search } from 'components'
import { OrderTypeFilter } from 'components/order-type-filter'
import { TableName } from 'components/table-name'
import { EnOrderStatus } from 'domain-model'
import { useFilter } from 'hooks'
import { SxProperty } from 'lib/constants'
import { routeMap } from 'lib/routes'
import { AddResourceButton, MyTabs } from 'lib/shortcuts'
import { formatOnlyDate } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouteConfig } from 'types/global'
import {
  useGetOrdersArchivedBySearchKeywordQuery,
  useGetOrdersByStatusQuery
} from 'types/graphql-shema'
import { OrdersTable } from './columns'
import { RequestReportPage } from './report/report.page'
import { useOrderListPageStore } from './stores/state'
import { t } from './text'

const PriorityList = observer(() => {
  const store = useOrderListPageStore()
  const { data } = useGetOrdersByStatusQuery({
    variables: {
      order_status: EnOrderStatus.Production
    }
  })
  const orders = useFilter({
    orders: data?.orders_orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })
  return (
    orders && (
      <Sheet>
        <Search
          value={store.searchTerm}
          onChange={store.searchInputHandler}
          placeholder={t.inputPlaceholder}
        >
          <ManagerFilter
            value={store.managerId}
            onChange={store.managerFilterHandler}
          />
        </Search>

        <OrdersTable data={orders} />
      </Sheet>
    )
  )
})

const RegistrationList = observer(() => {
  const store = useOrderListPageStore()
  const { data } = useGetOrdersByStatusQuery({
    variables: {
      order_status: EnOrderStatus.Registration
    }
  })
  const orders = useFilter({
    orders: data?.orders_orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })
  return (
    <>
      <Search
        value={store.searchTerm}
        onChange={store.searchInputHandler}
        placeholder={t.inputPlaceholder}
      >
        <ManagerFilter
          value={store.managerId}
          onChange={store.managerFilterHandler}
        />
      </Search>
      <OrdersTable data={orders} />
    </>
  )
})

const NewOrderList = observer(() => {
  const { data } = useGetOrdersByStatusQuery({
    variables: { order_status: EnOrderStatus.Production }
  })

  const { todayDate, yesterdayDate } = useMemo(() => {
    const today = moment()
    const yesterday = moment().subtract(1, 'day')
    return {
      todayDate: formatOnlyDate(today.toISOString()),
      yesterdayDate: formatOnlyDate(yesterday.toISOString())
    }
  }, [])

  const { ordersByToday, ordersByYesterday } = useMemo(() => {
    const orders = data?.orders_orders || []

    return {
      ordersByToday: orders.filter(
        each => formatOnlyDate(each.acceptance_date) === todayDate
      ),
      ordersByYesterday: orders.filter(
        each => formatOnlyDate(each.acceptance_date) === yesterdayDate
      )
    }
  }, [data?.orders_orders, todayDate, yesterdayDate])

  return (
    <>
      <TableName name={t.today} />
      <OrdersTable data={ordersByToday} />

      <TableName name={t.yesterday} />
      <OrdersTable data={ordersByYesterday} />
    </>
  )
})

const Archive = observer(() => {
  const store = useOrderListPageStore()

  const keyword = () => {
    if (!store.searchTerm) return ''
    if (store.searchTerm === '/all') return '%%'
    else return '%' + store.searchTerm + '%'
  }
  const { data } = useGetOrdersArchivedBySearchKeywordQuery({
    variables: {
      keyword: keyword(),
      order_status: store.orderStatusId
    }
  })
  const orders = useFilter({
    orders: data?.orders_orders || [],
    options: {
      managerId: store.managerId,
      orderStatusId: store.orderStatusId
    }
  })
  return (
    <>
      <Search
        value={store.searchTerm}
        onChange={store.searchInputHandler}
        placeholder={t.inputPlaceholder}
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
      <OrdersTable data={orders} />
    </>
  )
})

const { orders } = routeMap

const Wrapper = observer(
  (props: { children: React.ReactNode; sx?: SxProperty }) => {
    const navigate = useNavigate()
    const currentTab = useLocation().pathname
    function insertNewOrder() {
      navigate(`/orders/new`)
    }

    const tabs = {
      [t.preOrders]: orders.preOrders,
      [t.priorityList]: orders.priorityList,
      [t.recentlyPaidOrders]: orders.recentlyPaid,
      [t.report]: orders.report,
      [t.searchInArchive]: orders.archiveSearch
    }
    return (
      <Stack p={1}>
        <PageTitle title={t.ordersTitle}>
          <AddResourceButton onClick={() => insertNewOrder()} />
        </PageTitle>
        <MyTabs
          value={currentTab}
          tabs={tabs}
          handleChange={v => {
            navigate(v)
          }}
        />
        <Box sx={props.sx}>{props.children}</Box>
      </Stack>
    )
  }
)

const exportRoutes = (
  [
    {
      path: orders.preOrders,
      title: t.preOrders,
      element: <RegistrationList />
    },
    {
      path: orders.priorityList,
      title: t.priorityList,
      element: <PriorityList />
    },
    {
      path: orders.recentlyPaid,
      title: t.recentlyPaidOrders,
      element: <NewOrderList />
    },
    {
      path: orders.report,
      title: t.report,
      element: <RequestReportPage />
    },
    {
      path: orders.archiveSearch,
      title: t.searchInArchive,
      element: <Archive />
    }
  ] as const
).map(({ path, element }) => ({
  path,
  element: <Wrapper sx={{ p: 1 }}>{element}</Wrapper>
})) as RouteConfig[]

export default exportRoutes
