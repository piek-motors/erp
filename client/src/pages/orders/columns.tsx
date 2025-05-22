import { Stack, Typography } from '@mui/joy'
import { Table } from 'components/table.impl'
import { Order } from 'domain-model'
import { openOrderDetailPage } from 'lib/routes'
import { Link, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { Pre } from 'shortcuts'
import { TOrderColumnData } from 'types/global'
import { map } from './mappers'
import { t } from './text'
import { useMemo } from 'react'

const NEED_ATTENTION_COLOR = '#f5b9b9ba'
const AWAITING_DISPATCH_COLOR = '#cae9b4a3'

export const columnsList: Column<Order>[] = [
  {
    Header: t.id,
    accessor: (_row, counter) => counter + 1
  },
  {
    Header: t.name,
    accessor: o => {
      if (o.items.length === 0)
        return (
          <Link to={openOrderDetailPage(o.id)}>
            <Typography>{t.noContent}</Typography>
          </Link>
        )
      else {
        return (
          <Stack gap={1}>
            {o.items.map(item => (
              <div key={item.id}>
                <Pre>{item.name.trim()}</Pre>
              </div>
            ))}
          </Stack>
        )
      }
    }
  },
  {
    Header: t.quantity,
    accessor: o => (
      <Stack gap={1}>
        {o.items.map(item => (
          <Pre key={item.id}>{item.quantity}</Pre>
        ))}
      </Stack>
    )
  },
  {
    Header: t.plannedShipping,
    accessor: o => o.shippingDateString()
  },
  {
    Header: t.invoice,
    accessor: o => o.invoiceNumber
  },
  {
    Header: t.payment,
    accessor: o => o.paidPercentage()
  },
  {
    Header: t.contractor,
    accessor: o => o.contractor
  },
  {
    Header: t.city,
    accessor: o => o.city
  },
  {
    Header: t.manager,
    accessor: o => o.managerString()
  }
]

export function OrdersTable(props: { data: TOrderColumnData[] }) {
  const navigate = useNavigate()
  const onRowClick = (order: Order) => {
    navigate(openOrderDetailPage(order.id))
  }
  const columns = useMemo(() => columnsList, [])
  return (
    <Table
      trStyleCallback={row => {
        return {
          background: row.original?.needAttention
            ? NEED_ATTENTION_COLOR
            : row.original?.awatingDispatch
            ? AWAITING_DISPATCH_COLOR
            : ''
        }
      }}
      columns={columns}
      data={props.data.map(e => map.order.fromDto(e))}
      onRowClick={onRowClick}
    />
  )
}
