import { Stack } from '@mui/joy'
import { Table } from 'components/table.impl'
import { P, Pre } from 'lib/index'
import { openOrderDetailPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { Column } from 'react-table'
import { UnpackedOrder } from './api'
import { t } from './text'
import { getBackgroundColor } from './utils'

export const columns: Column<UnpackedOrder>[] = [
  {
    Header: t.id,
    accessor: order => order.id
  },
  {
    Header: t.name,
    accessor: order => {
      if (order.positions.length === 0)
        return (
          <Link to={openOrderDetailPage(order.id)}>
            <P>{t.noContent}</P>
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
    }
  },
  {
    Header: t.quantity,
    accessor: order => (
      <Stack gap={1}>
        {order.positions.map(item => (
          <Pre key={item.id}>{item.quantity}</Pre>
        ))}
      </Stack>
    )
  },
  {
    Header: t.plannedShipping,
    accessor: order => {
      if (!order.shipping_date) return ''
      return moment(order.shipping_date).format('DD.MM.YY')
    }
  },
  {
    Header: t.invoice,
    accessor: order => order.invoice_number
  },
  {
    Header: t.payment,
    accessor: order => {
      if (!order.total_amount) return ''
      if (!order.total_paid) return ''
      return `${((order.total_paid / order.total_amount) * 100).toFixed(0)}%`
    }
  },
  {
    Header: t.contractor,
    accessor: order => order.contractor
  },
  {
    Header: t.city,
    accessor: order => order.city
  }
]

export const OrdersTable = observer(
  (props: { data: UnpackedOrder[]; enableRowStyling?: boolean }) => {
    const navigate = useNavigate()
    const handleRowClick = (order: UnpackedOrder) => {
      navigate(openOrderDetailPage(order.id))
    }
    const memoizedColumns = useMemo(() => columns, [])
    const rowStyleCb = row => {
      return {
        background: getBackgroundColor(row.original)
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
  }
)
