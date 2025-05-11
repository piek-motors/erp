import { Stack, Typography } from '@mui/joy'
import moment from 'moment'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { TOrderColumnData } from 'src/types/global'
import { percentage } from 'src/utils/formatting'
import { Table } from '../../components/table.impl'
import { MyChip, Pre, Row } from '../../shortcuts'

export const columnsList: Column<TOrderColumnData>[] = [
  {
    Header: 'ID',
    id: 'index',
    accessor: (_row, counter) => counter + 1
  },
  {
    Header: 'Наим.',
    id: 'orderItems',
    accessor: data => {
      if (data.OrderItems.length === 0)
        return (
          <Link to={`/orders/${data.OrderID}`}>
            <Typography>Нет содержимого</Typography>
          </Link>
        )
      else
        return (
          <Row gap={1}>
            <Stack gap={1}>
              {data.OrderItems.map(item => (
                <div key={item.OrderItemID}>
                  <Pre>{item.Name.trim()}</Pre>
                </div>
              ))}
            </Stack>

            <Stack direction="row" gap={1}>
              <MyChip if={data.AwaitingDispatch} text={'Готов'} />
              <MyChip
                if={data.NeedAttention === 'true'}
                color="danger"
                text={'Внимание'}
              />
            </Stack>
          </Row>
        )
    }
  },
  {
    Header: 'Кол-во',
    accessor: data => (
      <Stack gap={1}>
        {data.OrderItems.map(item => (
          <Pre>{item.Quantity}</Pre>
        ))}
      </Stack>
    )
  },
  {
    Header: 'План. отгрузка',
    accessor: order => (
      <>{order.ShippingDate && moment(order.ShippingDate).format('DD.MM.YY')}</>
    )
  },
  {
    Header: 'Счет',
    accessor: 'InvoiceNumber'
  },
  {
    Header: 'Оплата',
    accessor: data => {
      const paidAmount = data.PaidAmount || data.PaymentHistories[0]?.PaidAmount
      return percentage(paidAmount, data.TotalAmount)
    }
  },
  {
    Header: 'Контрагент',
    accessor: data => <>{data.Entity}</>
  },
  {
    Header: 'Город',
    accessor: data => <>{data.City}</>
  },

  {
    Header: 'Менеджер',
    accessor: data => <> {data.User?.FirstName ? data.User?.FirstName : ''} </>
  }
]

export function OrdersTable(props: { data: TOrderColumnData[] }) {
  const navigate = useNavigate()
  const onDoubleRowClick = (row: TOrderColumnData) => {
    navigate(`/orders/${row.OrderID}`)
  }

  const columns = useMemo(() => columnsList, [])

  return (
    <Table
      columns={columns}
      data={props.data}
      onDoubleRowClick={onDoubleRowClick}
    />
  )
}
