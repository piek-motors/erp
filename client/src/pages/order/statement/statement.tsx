/** @jsxImportSource @emotion/react */
import { Box, Typography } from '@mui/joy'
import { formatOnlyDate } from 'src/lib/date'
import { TOrder } from 'src/types/global'

interface IAboutOrderProps {
  data: TOrder
}

export function AboutOrder({ data }: IAboutOrderProps) {
  const columns = [
    {
      heading: 'План. отгрузка',
      data: data.ShippingDate && formatOnlyDate(data.ShippingDate)
    },
    {
      heading: 'Номер заказа',
      data: data.OrderNumber
    },
    {
      heading: 'Счет / оплата',
      data: data.InvoiceNumber || ''
    },
    {
      heading: 'Контрагент',
      data: data.Entity
    },
    {
      heading: 'Менеджер',
      data: data.User && `${data.User.FirstName} ${data.User.LastName}`
    },
    {
      heading: 'Записан в системе',
      data: formatOnlyDate(data.CreatingDate)
    },
    {
      heading: 'Добавлен в очередность',
      data: formatOnlyDate(data.AcceptanceDate)
    },
    {
      heading: 'Факт. отгрузка',
      data: formatOnlyDate(data.ActualShippingDate)
    },
    {
      heading: 'Комментарий',
      data: data.Comment
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
