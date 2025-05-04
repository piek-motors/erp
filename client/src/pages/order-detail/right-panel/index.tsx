/** @jsxImportSource @emotion/react */
import { Box, Typography } from '@mui/joy'
import { formatDateWithTime, formatOnlyDate } from 'src/lib/date'
import { TOrder } from 'src/types/global'

export interface IAboutOrderProps {
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
      heading: 'Создан',
      data: formatOnlyDate(data.CreatingDate)
    },
    {
      heading: 'В очередности',
      data: formatOnlyDate(data.AcceptanceDate)
    },
    {
      heading: 'Факт. отгрузка',
      data: formatOnlyDate(data.ActualShippingDate)
    },
    {
      heading: 'Проблемки с',
      data: formatDateWithTime(data.NeedAttention?.split(',')[1]!)
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
        return <OrderProp key={el.heading} title={el.heading} value={el.data} />
      })}
    </>
  )
}

function OrderProp(props: { title: string; value: any }) {
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
