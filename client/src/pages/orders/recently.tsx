import { Sheet } from '@mui/joy'
import moment from 'moment'
import { useMemo } from 'react'
import { TableName } from 'src/components/table-name'
import { formatOnlyDate } from 'src/lib/date'
import { AppRoutes } from 'src/lib/routes'
import { NavTabs } from 'src/pages/orders/tabs'
import { OrderStatus, RouteConfig } from 'src/types/global'
import { useGetOrdersByStatusQuery } from 'src/types/graphql-shema'
import { columnsList } from './columns'
import { Table } from './shared/table'

function RecentOrders() {
  const { data } = useGetOrdersByStatusQuery({
    variables: { orderStatus: OrderStatus.ordProduction },
    fetchPolicy: 'cache-and-network'
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
      <NavTabs />
      <Sheet>
        <TableName name="Сегодня" />
        <Table columns={columns} data={ordersByToday} />

        <TableName name="Вчера" />
        <Table columns={columns} data={ordersByYesterday} />
      </Sheet>
    </>
  )
}

export default [
  {
    element: <RecentOrders />,
    path: AppRoutes.orders_recently
  }
] as RouteConfig[]
