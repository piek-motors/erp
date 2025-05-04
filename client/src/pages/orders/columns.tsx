import moment from 'moment'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { TOrderColumnData } from 'src/types/global'
import { percentage } from 'src/utils/formatting'
import { Table } from '../../components/table.impl'
import { Pre } from '../../shortcuts'

export const columnsList: Column<TOrderColumnData>[] = [
  {
    Header: '',
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
            <div>Нет содержимого</div>
          </Link>
        )
      else
        return (
          <>
            {data.OrderItems.map(item => (
              <div key={item.OrderItemID}>
                <Pre>{item.Name.trim()}</Pre>
              </div>
            ))}
          </>
        )
    }
  },
  {
    Header: 'Кол-во',
    accessor: data =>
      data.OrderItems.map(item => (
        <div key={item.OrderItemID}>
          <Pre>{item.Quantity}</Pre>
        </div>
      ))
  },
  {
    Header: 'План. отгрузка',
    accessor: order => (
      <>{order.ShippingDate && moment(order.ShippingDate).format('DD.MM.YY')}</>
    )
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
    Header: 'Счет',
    accessor: 'InvoiceNumber'
  },
  {
    Header: 'Оплата',
    accessor: data => {
      // Transition from old to new data structure
      const paidAmount = data.PaidAmount || data.PaymentHistories[0]?.PaidAmount
      return percentage(paidAmount, data.TotalAmount)
    }
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
