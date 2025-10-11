/** @jsxImportSource @emotion/react */
import { Sheet } from '@mui/joy'
import { FactoryPage } from 'components/factory_page'
import { Search } from 'components/inputs'
import { OrderTypeFilter } from 'components/order-type-filter'
import { TableName } from 'components/table-name'
import { TabConfig, Tabs } from 'components/tabs'
import { useFilter } from 'hooks'
import { SxProperty } from 'lib/constants'
import { AddResourceButton } from 'lib/index'
import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { formatOnlyDate } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import { OrderStatus } from 'models'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ordersApi, UnpackedOrder } from './api'
import { OrdersTable } from './columns'
import { orderListPageStore as store } from './list.store'
import { ManagerFilter } from './manager-filter'
import { RequestReportPage } from './report/report.page'
import { t } from './text'

const PriorityList = observer(() => {
  const [orders, setOrders] = useState<UnpackedOrder[]>([])
  useEffect(() => {
    ordersApi.loadOrders(OrderStatus.InProduction).then(setOrders)
  }, [])
  const filteredOrders = useFilter({
    orders,
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
          onChange={e => store.searchInputHandler(e)}
          placeholder={t.inputPlaceholder}
        >
          <ManagerFilter
            value={store.managerId}
            onChange={userId => store.managerFilterHandler(userId)}
          />
        </Search>
        <OrdersTable data={filteredOrders} enableRowStyling />
      </Sheet>
    )
  )
})

const RegistrationList = observer(() => {
  const [orders, setOrders] = useState<UnpackedOrder[]>([])
  useEffect(() => {
    ordersApi.loadOrders(OrderStatus.PreOrder).then(setOrders)
  }, [])
  const filteredOrders = useFilter({
    orders,
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })
  return (
    <>
      <Search
        value={store.searchTerm}
        onChange={e => store.searchInputHandler(e)}
        placeholder={t.inputPlaceholder}
      >
        <ManagerFilter
          value={store.managerId}
          onChange={userId => store.managerFilterHandler(userId)}
        />
      </Search>
      <OrdersTable data={filteredOrders} />
    </>
  )
})

const NewOrderList = observer(() => {
  const [orders, setOrders] = useState<UnpackedOrder[]>([])
  useEffect(() => {
    ordersApi.loadOrders(OrderStatus.InProduction).then(setOrders)
  }, [])

  const { todayDate, yesterdayDate } = useMemo(() => {
    const today = moment()
    const yesterday = moment().subtract(1, 'day')
    return {
      todayDate: formatOnlyDate(today.toISOString()),
      yesterdayDate: formatOnlyDate(yesterday.toISOString())
    }
  }, [])

  const { ordersByToday, ordersByYesterday } = useMemo(() => {
    return {
      ordersByToday: orders.filter(
        each => formatOnlyDate(each.acceptance_date) === todayDate
      ),
      ordersByYesterday: orders.filter(
        each => formatOnlyDate(each.acceptance_date) === yesterdayDate
      )
    }
  }, [orders, todayDate, yesterdayDate])

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
  const keyword = () => {
    if (!store.searchTerm) return ''
    if (store.searchTerm === '/all') return '%%'
    else return '%' + store.searchTerm + '%'
  }
  const [orders, setOrders] = useState<UnpackedOrder[]>([])
  useEffect(() => {
    if (!store.orderStatusId) {
      return
    }
    ordersApi.searchArchived(keyword(), store.orderStatusId).then(setOrders)
  }, [store.searchTerm, store.orderStatusId])

  const filteredOrders = useFilter({
    orders,
    options: {
      managerId: store.managerId,
      orderStatusId: store.orderStatusId
    }
  })
  return (
    <>
      <Search
        value={store.searchTerm}
        onChange={e => store.searchInputHandler(e)}
        placeholder={t.inputPlaceholder}
      >
        <ManagerFilter
          value={store.managerId}
          onChange={userId => store.managerFilterHandler(userId)}
        />
        <OrderTypeFilter
          value={store.orderStatusId}
          onChange={e => store.orderTypeFilterHandler(e)}
        />
      </Search>
      <OrdersTable data={filteredOrders} />
    </>
  )
})

const { orders } = routeMap

const tabs: TabConfig = [
  {
    value: routeMap.orders.preOrders,
    label: t.preOrders,
    component: <RegistrationList />
  },
  {
    value: routeMap.orders.priorityList,
    label: t.priorityList,
    component: <PriorityList />
  },
  {
    value: routeMap.orders.recentlyPaid,
    label: t.recentlyPaidOrders,
    component: <NewOrderList />
  },
  {
    value: routeMap.orders.report,
    label: t.report,
    component: <RequestReportPage />
  },
  {
    value: routeMap.orders.archiveSearch,
    label: t.searchInArchive,
    component: <Archive />
  }
]

const Wrapper = observer(
  (props: { children: React.ReactNode; sx?: SxProperty }) => {
    const navigate = useNavigate()
    const currentTab = useLocation().pathname
    function insertNewOrder() {
      navigate(`/orders/new`)
    }

    return (
      <FactoryPage
        title={t.ordersTitle}
        header={<AddResourceButton onClick={() => insertNewOrder()} />}
      >
        <Tabs
          tabs={tabs}
          value={currentTab}
          handleChange={(v: number) => {
            const url = tabs[v].value as any
            navigate(url)
          }}
        />
      </FactoryPage>
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
  element: <Wrapper>{element}</Wrapper>
})) as RouteConfig[]

export default exportRoutes
