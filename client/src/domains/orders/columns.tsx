import { Stack } from '@mui/joy'
import { Table } from 'components/table.impl'
import { P, Pre } from 'lib/index'
import { openOrderDetailPage } from 'lib/routes'
import { TOrderColumnData } from 'lib/types/global'
import { observer } from 'mobx-react-lite'
import { Order } from 'models'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { Column } from 'react-table'
import { map } from './order.mappers'
import { t } from './text'

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
            <P>{t.noContent}</P>
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
    accessor: o => o.manager.firstName
  }
]

export const OrdersTable = observer((props: { data: TOrderColumnData[] }) => {
  const navigate = useNavigate()
  const onRowClick = (order: Order) => {
    navigate(openOrderDetailPage(order.id))
  }
  const columns = useMemo(() => columnsList, [])

  const mappedData = useMemo(
    () => props.data.map(e => map.order.fromDto(e)),
    [props.data]
  )

  return (
    <Table
      trStyleCallback={row => {
        return {
          background: row.original?.getBackgroundColor()
        }
      }}
      columns={columns}
      data={mappedData}
      onRowClick={onRowClick}
    />
  )
})
