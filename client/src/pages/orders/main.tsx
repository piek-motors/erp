/** @jsxImportSource @emotion/react */
import { Box, Sheet, Stack } from '@mui/joy'
import { ManagerFilter, PageTitle, Search } from 'components'
import { OrderTypeFilter } from 'components/order-type-filter'
import { TableName } from 'components/table-name'
import { EnOrderStatus } from 'domain-model'
import { useFilter } from 'hooks'
import { SxProperty } from 'lib/constants'
import { ListOrdersRoutes } from 'lib/routes'
import moment from 'moment'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddResourceButton, MyTabs } from 'shortcuts'
import { RouteConfig } from 'types/global'
import {
  useGetOrdersArchivedBySearchKeywordQuery,
  useGetOrdersByStatusQuery,
  useInsertOrderMutation
} from 'types/graphql-shema'
import { formatOnlyDate } from 'utils/formatting'
import { columnsList, OrdersTable } from './columns'
import { RequestReportPage } from './report.page'
import { useOrderListPageStore } from './state'
import { t } from './text'

function PriorityList() {
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
}

function RegistrationList() {
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
}

function NewOrderList() {
  const { data } = useGetOrdersByStatusQuery({
    variables: { order_status: EnOrderStatus.Production }
  })

  const ordersByToday =
    data?.orders_orders.filter(
      each =>
        formatOnlyDate(each.acceptance_date) ===
        formatOnlyDate(moment().toISOString())
    ) || []

  const ordersByYesterday =
    data?.orders_orders.filter(
      each =>
        formatOnlyDate(each.acceptance_date) ===
        formatOnlyDate(moment().subtract(1, 'day').toISOString())
    ) || []

  const columns = useMemo(() => columnsList, [])

  return (
    <>
      <TableName name={t.today} />
      <OrdersTable data={ordersByToday} />

      <TableName name={t.yesterday} />
      <OrdersTable data={ordersByYesterday} />
    </>
  )
}

function Archive() {
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
}

function Wrapper(props: { children: React.ReactNode; sx?: SxProperty }) {
  const navigate = useNavigate()
  const [insertOrderMutation] = useInsertOrderMutation({
    variables: {
      status: EnOrderStatus.Registration
    }
  })

  const currentTab = useLocation().pathname
  function insertOrderHandler() {
    insertOrderMutation().then(res => {
      navigate(
        `/order/${res.data?.insert_orders_orders?.returning[0].id}?edit=true`
      )
    })
  }

  const tabs = {
    [t.preOrders]: ListOrdersRoutes.pre_orders,
    [t.priorityList]: ListOrdersRoutes.priority_list,
    [t.recentlyPaidOrders]: ListOrdersRoutes.recent_paid_orders,
    [t.report]: ListOrdersRoutes.report,
    [t.searchInArchive]: ListOrdersRoutes.search_in_archive
  }
  return (
    <Stack p={1}>
      <PageTitle title={t.ordersTitle}>
        <AddResourceButton onClick={() => insertOrderHandler()} />
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

const routes = [
  {
    path: ListOrdersRoutes.pre_orders,
    title: t.preOrders,
    element: <RegistrationList />
  },
  {
    path: ListOrdersRoutes.priority_list,
    title: t.priorityList,
    element: <PriorityList />
  },
  {
    path: ListOrdersRoutes.recent_paid_orders,
    title: t.recentlyPaidOrders,
    element: <NewOrderList />
  },
  {
    path: ListOrdersRoutes.report,
    title: t.report,
    element: <RequestReportPage />
  },
  {
    path: ListOrdersRoutes.search_in_archive,
    title: t.searchInArchive,
    element: <Archive />
  }
] as const

const exportRoutes = routes.map(({ path, element }) => ({
  path,
  element: <Wrapper sx={{ p: 1 }}>{element}</Wrapper>
})) as RouteConfig[]

export default exportRoutes
