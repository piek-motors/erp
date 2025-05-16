/** @jsxImportSource @emotion/react */
import { Box, Sheet } from '@mui/joy'
import { ManagerFilter, Search } from 'components'
import { OrderTypeFilter } from 'components/order-type-filter'
import { TableName } from 'components/table-name'
import { EnOrderStatus, OrderStatus } from 'domain-model'
import { useFilter } from 'hooks'
import { RuMonths, SxProperty } from 'lib/constants'
import { formatOnlyDate, getPreviousMonth } from 'lib/date'
import moment from 'moment'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  useGetOrdersArchivedBySearchKeywordQuery,
  useGetOrdersByStatusQuery,
  useInsertOrderMutation
} from 'types/graphql-shema'
import { PageTitle } from 'components'
import { ListOrdersRoutes } from 'lib/routes'
import { AddResourceButton, MyTabs } from 'shortcuts'
import { RouteConfig } from 'types/global'
import { columnsList, OrdersTable } from './columns'
import { useOrderListPageStore } from './state'
import { t } from './text'
import { useReport } from './use-report'

function PriorityList() {
  const store = useOrderListPageStore()
  const { data } = useGetOrdersByStatusQuery({
    variables: {
      orderStatus: EnOrderStatus.Production
    }
  })
  const orders = useFilter({
    orders: data?.erp_Orders || [],
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
      orderStatus: EnOrderStatus.Registration
    }
  })
  const orders = useFilter({
    orders: data?.erp_Orders || [],
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
    variables: { orderStatus: OrderStatus.ordProduction }
  })

  const ordersByToday =
    data?.erp_Orders.filter(
      each =>
        formatOnlyDate(each.AcceptanceDate) ===
        formatOnlyDate(moment().toISOString())
    ) || []

  const ordersByYesterday =
    data?.erp_Orders.filter(
      each =>
        formatOnlyDate(each.AcceptanceDate) ===
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

function Report() {
  const { data } = useReport()
  const columns = useMemo(() => {
    const a = [...columnsList]
    a[3] = {
      Header: 'Факт отгрузка',
      accessor: order => formatOnlyDate(order.ActualShippingDate)
    }
    return a
  }, [])

  if (data.loading) return null

  return (
    <>
      <TableName name={t.shipmentsInTheCurrentMonth} />
      {Array.isArray(data.ordersCurrentMonth) && (
        <OrdersTable data={data.ordersCurrentMonth} />
      )}

      <div>
        <TableName name={`Отгрузка за ${RuMonths[getPreviousMonth()]}`} />
        {Array.isArray(data.ordersAccountingMonth) && (
          <OrdersTable data={data.ordersAccountingMonth} />
        )}
      </div>
    </>
  )
}

function Archive() {
  const columns = useMemo(() => {
    const a = [...columnsList]
    a[3] = {
      Header: t.factShipment,
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
      orderStatusID: OrderStatus.ordRegistration
    }
  })

  // const currentTab = searchParams.get('tab') || t.PreOrders
  const currentTab = useLocation().pathname
  function insertOrderHandler() {
    insertOrderMutation().then(res => {
      navigate(
        `/order/${res.data?.insert_erp_Orders?.returning[0].OrderID}?edit=true`
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
    <>
      <PageTitle title={t.ordersTitle}>
        <AddResourceButton onClick={() => insertOrderHandler()} />
      </PageTitle>
      <MyTabs
        value={currentTab}
        tabs={tabs}
        handleChange={v => {
          console.log(v)
          navigate(v)
        }}
      />
      <Box sx={props.sx}>{props.children}</Box>
    </>
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
    element: <Report />
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
