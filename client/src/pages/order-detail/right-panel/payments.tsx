/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Box,
  Button,
  Dropdown,
  Menu,
  MenuButton,
  Stack,
  Typography
} from '@mui/joy'
import moment from 'moment'
import * as React from 'react'
import { useAppContext } from 'src/hooks'
import { formatOnlyDate } from 'src/lib/date'
import { TOrder, UserStatus } from 'src/types/global'
import {
  GetOrderPaymentsQuery,
  useDeletePaymentMutation,
  useGetOrderPaymentsQuery,
  useInsertPaymentMutation
} from 'src/types/graphql-shema'
import * as formatter from 'src/utils/formatting'
import { OrderInfoCard } from '.'
import { MyInput, Row } from '../../../shortcuts'

type Order = Pick<TOrder, 'TotalAmount' | 'OrderID'>

export interface IPaymnetHistoryProps {
  data: Order
}

export const NO_TOTAL_AMOUNT_MESSAGE = 'Не задана сумма заказа'

export default function PaymnetHistory({ data }: IPaymnetHistoryProps) {
  const [deletePayment] = useDeletePaymentMutation()
  const { data: payments, refetch } = useGetOrderPaymentsQuery({
    variables: { _eq: data.OrderID }
  })
  const { store }: any = useAppContext()

  async function handleDelete(ID: number) {
    await deletePayment({
      variables: {
        ID
      }
    })

    refetch()
  }

  const isHaveFullRight = [
    UserStatus.general,
    UserStatus.management,
    UserStatus.bookkeeping
  ].includes(store?.user?.AccessLevelID)

  return (
    <OrderInfoCard heading="История оплаты">
      {data.TotalAmount ? (
        <PrintPayment
          data={payments?.erp_PaymentHistory || []}
          isHaveFullRight
          onDelete={ID => handleDelete(ID)}
          totalAmount={data.TotalAmount}
        />
      ) : (
        <Typography>{NO_TOTAL_AMOUNT_MESSAGE}</Typography>
      )}
      {isHaveFullRight && (
        <AddNewPayment
          order={data}
          refetch={refetch}
          defaultValues={{ date: new Date().toISOString() }}
        />
      )}
    </OrderInfoCard>
  )
}

function PrintPayment(props: {
  data: GetOrderPaymentsQuery['erp_PaymentHistory']
  isHaveFullRight?: boolean
  totalAmount: number
  onDelete?: (ID: number) => void
}) {
  const { totalAmount, isHaveFullRight } = props

  return (
    <Stack direction="column" width="100%">
      {props.data.map(payment => (
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          css={css({
            '&:hover': {
              '.editPayment': {
                opacity: 1
              }
            }
          })}
          key={payment.Date + payment.PaidAmount}
        >
          <Box width="25%">
            {formatter.percentage(payment.PaidAmount, totalAmount)}
          </Box>
          <div>{formatOnlyDate(payment.Date)}</div>
          {isHaveFullRight && (
            <Button
              color="danger"
              variant="outlined"
              className="editPayment"
              css={css({
                opacity: 0,
                cursor: 'pointer',
                marginLeft: '20px'
              })}
              onClick={() => props.onDelete?.(payment.ID)}
            >
              Удалить
            </Button>
          )}
        </Box>
      ))}
    </Stack>
  )
}

interface AddNewPaymentProps {
  defaultValues: {
    date?: string | null
    amount?: number
  }
  refetch(): void
  order: Order
}

function AddNewPayment(props: AddNewPaymentProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [insertPayment] = useInsertPaymentMutation()
  const [data, setData] = React.useState<{
    date?: string | null
    amount?: number
  }>(props.defaultValues)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  async function handleSave() {
    if (!data.date || !data.amount) {
      throw Error('data is not valid')
    }
    await insertPayment({
      variables: {
        Date: moment(data.date).toISOString(),
        OrderID: props.order.OrderID,
        PaidAmount: data.amount
      }
    })

    handleClose()
    props.refetch()
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, date: moment(e.target.value, 'DDMMYY').toISOString() })
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, amount: parseInt(e.target.value) })
  }

  return (
    <Dropdown>
      <MenuButton onClick={handleClick} variant="plain">
        Добавить
      </MenuButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSave()
          }
        }}
      >
        <Stack gap={1} p={2}>
          <MyInput
            label="Дата"
            placeholder="dd.mm.yy"
            onChange={handleDateChange}
            default={moment(props.defaultValues?.date).format('DD.MM.YY')}
          />
          <Row gap={1}>
            <MyInput
              label="Уже оплачено"
              onChange={handleAmountChange}
              default={props.defaultValues?.amount?.toString() || ''}
              autoFocus
            />
            <Typography>
              из {formatter.money(props.order.TotalAmount)}
            </Typography>
          </Row>
          <Button onClick={handleSave}>Сохранить</Button>
        </Stack>
      </Menu>
    </Dropdown>
  )
}
