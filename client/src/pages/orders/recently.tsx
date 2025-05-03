import moment from 'moment'
import { useMemo } from 'react'
import { TableName } from 'src/components/table-name'
import { formatOnlyDate } from 'src/lib/date'
import { OrderStatus } from 'src/types/global'
import { useGetOrdersByStatusQuery } from 'src/types/graphql-shema'
import { columnsList } from './columns'
import { Table } from './shared/table'

export function RecentOrders() {
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
      <TableName name="Сегодня" />
      <Table columns={columns} data={ordersByToday} />

      <TableName name="Вчера" />
      <Table columns={columns} data={ordersByYesterday} />
    </>
  )
}
