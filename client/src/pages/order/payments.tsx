/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { JSX } from '@emotion/react/jsx-runtime'
import {
  Box,
  Button,
  Dropdown,
  Menu,
  MenuButton,
  Stack,
  Table,
  Typography
} from '@mui/joy'
import { Roles } from 'domain-model'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import * as React from 'react'
import { MyInput, Row } from 'shortcuts'
import { TOrder } from 'types/global'
import {
  GetOrderPaymentsQuery,
  useDeletePaymentMutation,
  useGetOrderPaymentsQuery,
  useInsertPaymentMutation
} from 'types/graphql-shema'
import * as formatter from 'utils/formatting'

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

  const paymentHistoryContent = data.TotalAmount ? (
    <PaymentsTable
      data={payments?.erp_PaymentHistory || []}
      onDelete={ID => handleDelete(ID)}
      totalAmount={data.TotalAmount}
      footerComponent={
        <Box>
          {isHaveFullRight && (
            <NewPaymentInput
              order={data}
              refetch={refetch}
              defaultValues={{ date: new Date().toISOString() }}
            />
          )}
        </Box>
      }
    />
  ) : (
    <Typography>{NO_TOTAL_AMOUNT_MESSAGE}</Typography>
  )

  return (
    <Box my={1}>
      <Typography>Платежи</Typography>
      {paymentHistoryContent}
    </Box>
  )
}

const PaymentsTable = observer(
  (props: {
    data: GetOrderPaymentsQuery['erp_PaymentHistory']
    totalAmount: number
    onDelete?: (ID: number) => void
    footerComponent: JSX.Element
  }) => {
    const { totalAmount } = props

    const totalPaid = props.data.reduce((acc, payment) => {
      return acc + payment.PaidAmount
    }, 0)

    const totalPaidPercent = formatter.percentage(totalPaid, totalAmount)

    return (
      <Box>
        <Table
          css={css`
            td {
              padding: 5px 10px;
              text-align: center;
            }
            th {
              text-align: center;
            }
          `}
          sx={{ width: 'max-content' }}
          size="sm"
          style={{ tableLayout: 'auto' }}
        >
          <tbody>
            {props.data.map(payment => (
              <tr>
                <td>{formatter.percentage(payment.PaidAmount, totalAmount)}</td>
                <td>{formatter.money(payment.PaidAmount)}</td>
                <td>{formatter.formatOnlyDate(payment.Date)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td> {totalPaidPercent}</td>
              <td>{formatter.money(totalPaid)}</td>
              {props.footerComponent && <td>{props.footerComponent}</td>}
            </tr>
          </tfoot>
        </Table>
      </Box>
    )
  }
)

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
    const parsedValue = e.target.value.replace(',', '').replace('.', '')
    const amount = parseInt(parsedValue)
    setData({ ...data, amount })
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={(e, open) => {
        if (open === false) {
          setAnchorEl(null)
        } else {
          setAnchorEl(e?.target as HTMLButtonElement)
        }
      }}
    >
      <MenuButton variant="outlined" size="sm">
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
        <Stack gap={1} p={1}>
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
              // TODO: make controlled intput in order to make button for payed alll
              // value={props.order.TotalAmount}
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
