import moment from 'moment'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'
import { TOrderColumnData } from 'src/types/global'
import { percentage } from 'src/utils/formatting'

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
                <span>{item.Name}</span>
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
          <div>{item.Quantity}</div>
        </div>
      ))
  },
  {
    Header: 'План. отгрузка',
    accessor: order => (
      <>
        {' '}
        {order.ShippingDate &&
          moment(order.ShippingDate).format('DD.MM.YY')}{' '}
      </>
    )
  },
  {
    Header: 'Компания / город',
    accessor: data => (
      <div>
        <div>
          <b>{data.Entity}</b>
        </div>
        <>{data.City}</>
      </div>
    )
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
