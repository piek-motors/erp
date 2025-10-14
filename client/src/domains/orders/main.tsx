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
import { columns, OrdersTable, withActualShippingDate } from './columns'
import { orderListPageStore as store } from './list.store'
import { ManagerFilter } from './manager-filter'
import { RequestReportPage } from './report/report.page'

const searchPlaceholder = 'Счет, контрагент'

const PriorityList = observer(() => {
  const [orders, setOrders] = useState<UnpackedOrder[]>([])
  useEffect(() => {
    ordersApi
      .loadOrders(OrderStatus.InProduction, {
        column: 'shipping_date',
        type: 'desc'
      })
      .then(setOrders)
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
          placeholder={searchPlaceholder}
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
    ordersApi
      .loadOrders(OrderStatus.PreOrder, { column: 'id', type: 'desc' })
      .then(setOrders)
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
        placeholder={searchPlaceholder}
      >
        <ManagerFilter
          value={store.managerId}
          onChange={userId => store.managerFilterHandler(userId)}
        />
      </Search>
      <OrdersTable data={filteredOrders} enableRowStyling />
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
      <TableName name={'Сегодня'} />
      <OrdersTable data={ordersByToday} />

      <TableName name={'Вчера'} />
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
        placeholder={searchPlaceholder}
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
      <OrdersTable
        data={filteredOrders}
        columns={withActualShippingDate(columns)}
      />
    </>
  )
})

const { orders } = routeMap

const tabs: TabConfig = [
  {
    value: routeMap.orders.preOrders,
    label: 'Предзаказы',
    component: <RegistrationList />
  },
  {
    value: routeMap.orders.priorityList,
    label: 'Очередность',
    component: <PriorityList />
  },
  {
    value: routeMap.orders.recentlyPaid,
    label: 'Недавно оплаченные',
    component: <NewOrderList />
  },
  {
    value: routeMap.orders.report,
    label: 'Отчет',
    component: <RequestReportPage />
  },
  {
    value: routeMap.orders.archiveSearch,
    label: 'Архив',
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
        title={'Заказы'}
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
      title: 'Предзаказы',
      element: <RegistrationList />
    },
    {
      path: orders.priorityList,
      title: 'Очередность',
      element: <PriorityList />
    },
    {
      path: orders.recentlyPaid,
      title: 'Недавно оплаченные',
      element: <NewOrderList />
    },
    {
      path: orders.report,
      title: 'Отчет',
      element: <RequestReportPage />
    },
    {
      path: orders.archiveSearch,
      title: 'Архив',
      element: <Archive />
    }
  ] as const
).map(({ path, element }) => ({
  path,
  element: <Wrapper>{element}</Wrapper>
})) as RouteConfig[]

export default exportRoutes
