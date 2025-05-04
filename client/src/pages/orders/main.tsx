/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Sheet } from '@mui/joy'
import moment from 'moment'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { EnOrderStatus, OrderStatus } from 'shared'
import { ManagerFilter, Search } from 'src/components'
import { OrderTypeFilter } from 'src/components/order-type-filter'
import { TableName } from 'src/components/table-name'
import { useFilter } from 'src/hooks'
import { RuMonths } from 'src/lib/constants'
import { formatOnlyDate, getPreviousMonth } from 'src/lib/date'
import {
  useGetOrdersArchivedBySearchKeywordQuery,
  useGetOrdersByStatusQuery,
  useInsertOrderMutation
} from 'src/types/graphql-shema'
import { PageTitle } from '../../components'
import { AddButton, MyTabs } from '../../shortcuts'
import { columnsList, OrdersTable } from './columns'
import { useOrderListPageStore } from './state'
import { t } from './text'
import { useReport } from './use-report'

function PrimaryList() {
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
          placeholder={t.InputPlaceholder}
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
        placeholder={t.InputPlaceholder}
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
      <TableName name={t.Today} />
      <OrdersTable data={ordersByToday} />

      <TableName name={t.Yesterday} />
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
      <TableName name={t.ShipmentsInTheCurrentMonth} />
      {Array.isArray(data.ordersCurrentMonth) && (
        <OrdersTable data={data.ordersCurrentMonth} />
      )}

      <div
        css={css`
          margin-top: 30px;
        `}
      >
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
      Header: t.FactShipment,
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
      <OrdersTable data={orders} />
    </>
  )
}

export function Orders() {
  const navigate = useNavigate()
  const [insertOrderMutation] = useInsertOrderMutation({
    variables: {
      orderStatusID: OrderStatus.ordRegistration
    }
  })
  function insertOrderHandler() {
    insertOrderMutation().then(res => {
      navigate(
        `/orders/${res.data?.insert_erp_Orders?.returning[0].OrderID}?edit=true`
      )
    })
  }
  return (
    <>
      <PageTitle title={t.OrdersTitle}>
        <AddButton onClick={() => insertOrderHandler()} />
      </PageTitle>
      <MyTabs
        tabs={{
          [t.PriorityMap]: <PrimaryList />,
          [t.PreOrders]: <RegistrationList />,
          [t.RecentplyPaidOrders]: <NewOrderList />,
          [t.Report]: <Report />,
          [t.SearchInArchive]: <Archive />
        }}
      />
    </>
  )
}
