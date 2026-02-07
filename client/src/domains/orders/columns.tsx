import { Table } from '@/components/table.impl'
import { Label, P, Pre } from '@/lib/index'
import { openOrderDetailPage } from '@/lib/routes'
import { Stack } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import type { Column } from 'react-table'
import type { UnpackedOrder } from './api'
import { getBackgroundColor } from './utils'

export const columns: Column<UnpackedOrder>[] = [
  {
    Header: 'ID',
    accessor: order => <Label xs>{order.id}</Label>,
  },
  {
    Header: 'Позиции',
    accessor: order => {
      if (order.positions.length === 0)
        return (
          <Link to={openOrderDetailPage(order.id)}>
            <P>{'Заказ пуст'}</P>
          </Link>
        )
      else {
        return (
          <Stack gap={1}>
            {order.positions.map(item => (
              <div key={item.id}>
                <Pre>{item.name?.trim()}</Pre>
              </div>
            ))}
          </Stack>
        )
      }
    },
  },
  {
    Header: 'Кол.',
    accessor: order => (
      <Stack gap={1}>
        {order.positions.map(item => (
          <Pre key={item.id}>{item.quantity}</Pre>
        ))}
      </Stack>
    ),
  },
  {
    Header: 'План. отгрузка',
    accessor: order => {
      if (!order.shipping_date) return ''
      return moment(order.shipping_date).format('DD.MM.YY')
    },
  },
  {
    Header: 'Счет',
    accessor: order => order.invoice_number,
  },
  {
    Header: 'Оплачено',
    accessor: order => {
      if (!order.total_amount) return ''
      if (!order.total_paid) return ''
      return `${((order.total_paid / order.total_amount) * 100).toFixed(0)}%`
    },
  },
  {
    Header: 'Контрагент',
    accessor: order => order.contractor,
  },
  {
    Header: 'Город',
    accessor: order => order.city,
  },
]

export const withActualShippingDate = (columns: Column<UnpackedOrder>[]) => {
  const idx = 3 // План. отгрузка - обычно 3-й индекс (нумерация с нуля)
  const actualShippingColumn: Column<UnpackedOrder> = {
    Header: 'Факт. отгрузка',
    accessor: order => {
      if (!order.actual_shipping_date) return ''
      return moment(order.actual_shipping_date).format('DD.MM.YY')
    },
  }
  return [
    ...columns.slice(0, idx + 1),
    actualShippingColumn,
    ...columns.slice(idx + 1),
  ]
}

export const OrdersTable = observer(
  (props: {
    data: UnpackedOrder[]
    enableRowStyling?: boolean
    columns?: Column<UnpackedOrder>[]
  }) => {
    const navigate = useNavigate()
    const handleRowClick = (order: UnpackedOrder) => {
      navigate(openOrderDetailPage(order.id))
    }
    const memoizedColumns = useMemo(() => props.columns || columns, [])
    const rowStyleCb = row => {
      return {
        background: getBackgroundColor(row.original),
      }
    }
    return (
      <Table
        rowStyleCb={props.enableRowStyling ? rowStyleCb : undefined}
        columns={memoizedColumns}
        data={props.data}
        onRowClick={handleRowClick}
      />
    )
  },
)
