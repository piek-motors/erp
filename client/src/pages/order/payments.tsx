/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  Dropdown,
  Menu,
  MenuButton,
  Sheet,
  Stack,
  Typography
} from '@mui/joy'
import { Roles } from 'domain-model'
import { useAppContext } from 'hooks'
import { Observer } from 'mobx-react-lite'
import moment from 'moment'
import * as React from 'react'
import { DeleteResourceButton, MyInput, Row } from 'shortcuts'
import { TOrder } from 'types/global'
import {
  GetOrderPaymentsQuery,
  useDeletePaymentMutation,
  useGetOrderPaymentsQuery,
  useInsertPaymentMutation
} from 'types/graphql-shema'
import * as formatter from 'utils/formatting'
import { orderStore } from './order.store'

type Order = Pick<TOrder, 'TotalAmount' | 'OrderID'>

export const NO_TOTAL_AMOUNT_MESSAGE = 'Не задана сумма заказа'

export function Paymnets({ data }: { data: TOrder }) {
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
    Roles.general,
    Roles.management,
    Roles.bookkeeping
  ].includes(store?.user?.AccessLevelID)

  return (
    <Box width={'min-content'} my={2}>
      <Sheet sx={{ borderRadius: 5 }}>
        <Row p={1} gap={5} alignItems={'start'} justifyContent={'start'}>
          <Typography>Платежи</Typography>
          <Box>
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
              <NewPaymentInput
                order={data}
                refetch={refetch}
                defaultValues={{ date: new Date().toISOString() }}
              />
            )}
          </Box>
        </Row>
      </Sheet>
    </Box>
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
    <Observer
      render={() => {
        return (
          <Stack>
            {props.data.map(payment => (
              <Row
                key={payment.Date + payment.PaidAmount}
                justifyContent={'space-between'}
              >
                <Row>
                  <Typography>
                    {formatter.percentage(payment.PaidAmount, totalAmount)}
                  </Typography>
                  <Typography>{formatter.money(payment.PaidAmount)}</Typography>
                </Row>
                {isHaveFullRight && orderStore.editMode && (
                  <DeleteResourceButton
                    onClick={() => props.onDelete?.(payment.ID)}
                  />
                )}
              </Row>
            ))}
          </Stack>
        )
      }}
    />
  )
}

interface NewPaymentInputProps {
  defaultValues: {
    date?: string | null
    amount?: number
  }
  refetch(): void
  order: Order
}

function NewPaymentInput(props: NewPaymentInputProps) {
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
    setData({
      ...data,
      amount: parseInt(e.target.value.replace(',', '').replace('.', ''))
    })
  }

  return (
    <Dropdown>
      <MenuButton onClick={handleClick} variant="plain" size="sm">
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
              type="number"
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
