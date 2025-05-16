import { Stack, Typography } from '@mui/joy'
import moment from 'moment'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { TOrderColumnData } from 'types/global'
import { percentage } from 'utils/formatting'
import { Table } from 'components/table.impl'
import { Pre } from 'shortcuts'
import { t } from './text'
import { openOrderDetailPage } from 'lib/routes'

const NEED_ATTENTION_COLOR = '#f5b9b9ba'
const AWAITING_DISPATCH_COLOR = '#cae9b4a3'

export const columnsList: Column<TOrderColumnData>[] = [
  {
    Header: t.id,
    id: 'index',
    accessor: (_row, counter) => counter + 1
  },
  {
    Header: t.name,
    id: 'orderItems',
    accessor: data => {
      if (data.OrderItems.length === 0)
        return (
          <Link to={openOrderDetailPage(data.OrderID)}>
            <Typography>{t.noContent}</Typography>
          </Link>
        )
      else {
        return (
          <Stack gap={1}>
            {data.OrderItems.map(item => (
              <div key={item.OrderItemID}>
                <Pre>{item.Name.trim()}</Pre>
              </div>
            ))}
          </Stack>
        )
      }
    }
  },
  {
    Header: t.quantity,
    accessor: data => (
      <Stack gap={1}>
        {data.OrderItems.map(item => (
          <Pre>{item.Quantity}</Pre>
        ))}
      </Stack>
    )
  },
  {
    Header: t.plannedShipping,
    accessor: order => (
      <>{order.ShippingDate && moment(order.ShippingDate).format('DD.MM.YY')}</>
    )
  },
  {
    Header: t.invoice,
    accessor: 'InvoiceNumber'
  },
  {
    Header: t.payment,
    accessor: data => {
      const paidAmount = data.PaidAmount || data.PaymentHistories[0]?.PaidAmount
      return percentage(paidAmount, data.TotalAmount)
    }
  },
  {
    Header: t.contractor,
    accessor: data => <>{data.Entity}</>
  },
  {
    Header: t.city,
    accessor: data => <>{data.City}</>
  },
  {
    Header: t.manager,
    accessor: data => <> {data.User?.FirstName ? data.User?.FirstName : ''} </>
  }
]

export function OrdersTable(props: { data: TOrderColumnData[] }) {
  const navigate = useNavigate()
  const onDoubleRowClick = (row: TOrderColumnData) => {
    navigate(openOrderDetailPage(row.OrderID))
  }
  const columns = useMemo(() => columnsList, [])
  return (
    <Table
      trStyleCallback={row => {
        return {
          background:
            row.original?.NeedAttention === 'true'
              ? NEED_ATTENTION_COLOR
              : row.original?.AwaitingDispatch
              ? AWAITING_DISPATCH_COLOR
              : ''
        }
      }}
      columns={columns}
      data={props.data}
      onDoubleRowClick={onDoubleRowClick}
    />
  )
}
