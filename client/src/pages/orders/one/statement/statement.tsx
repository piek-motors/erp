/** @jsxImportSource @emotion/react */
import { Box, Typography } from '@mui/joy'
import { Order } from 'domain-model'

interface IAboutOrderProps {
  o: Order
}

export function AboutOrder({ o }: IAboutOrderProps) {
  const columns = [
    {
      heading: 'План. отгрузка',
      data: o.shippingDateString()
    },
    {
      heading: 'Номер заказа',
      data: o.factoryNumber
    },
    {
      heading: 'Номер счета',
      data: o.invoiceNumber
    },
    {
      heading: 'Сумма заказа',
      data: o.totalAmount
    },
    {
      heading: 'Оплачено',
      data: `${o.totalPaidString()} (${o.paidPercentage()})`
    },
    {
      heading: 'Контрагент',
      data: o.contractor
    },
    {
      heading: 'Менеджер',
      data: o.managerString()
    },
    {
      heading: 'Записан в системе',
      data: o.createdAtString()
    },
    {
      heading: 'Добавлен в очередность',
      data: o.acceptanceDateString()
    },
    {
      heading: 'Факт. отгрузка',
      data: o.actualShippingDateString()
    },
    {
      heading: 'Комментарий',
      data: o.comment
    }
  ]
  return (
    <>
      {columns.map(el => {
        if (!el.data || el.data === 'Invalid date') return null
        return (
          <OrderProperty key={el.heading} title={el.heading} value={el.data} />
        )
      })}
    </>
  )
}

function OrderProperty(props: { title: string; value: any }) {
  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
      sx={{ gap: 7 }}
    >
      <Typography style={{ whiteSpace: 'nowrap' }}>{props.title}</Typography>
      <div
        style={{
          flex: 1,
          borderBottom: '1px dotted #aaa',
          height: 1
        }}
      />
      <Typography style={{ whiteSpace: 'normal' }}>{props.value}</Typography>
    </Box>
  )
}

