/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { JSX } from '@emotion/react/jsx-runtime'
import * as joy from '@mui/joy'
import { Order, Roles } from 'domain-model'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import * as React from 'react'
import { useEffect } from 'react'
import { Inp, Row } from 'shortcuts'
import { GetOrderPaymentsQuery } from 'types/graphql-shema'
import * as formatter from 'utils/formatting'
import { paymentStore } from './store'

export const Paymnets = observer(({ order }: { order: Order }) => {
  const { store }: any = useAppContext()
  useEffect(() => {
    paymentStore.init(order.id)
  }, [order.id])

  const isHaveFullRight = [
    Roles.general,
    Roles.management,
    Roles.bookkeeping
  ].includes(store?.user?.role)

  const paymentHistoryContent = order.totalAmount ? (
    <PaymentsTable
      data={paymentStore.payments}
      onDelete={ID => paymentStore.deletePayment(ID)}
      totalAmount={order.totalAmount}
      loading={paymentStore.loading}
      footerComponent={
        <joy.Box>
          {isHaveFullRight && <NewPaymentInput order={order} />}
        </joy.Box>
      }
    />
  ) : (
    <joy.Typography level="body-xs" color="danger">
      Не задана сумма заказа
    </joy.Typography>
  )

  return (
    <joy.Box my={1}>
      <joy.Typography>Платежи</joy.Typography>
      {paymentHistoryContent}
    </joy.Box>
  )
})

const PaymentsTable = observer(
  (props: {
    data: GetOrderPaymentsQuery['orders_order_payments']
    totalAmount: number
    loading: boolean
    onDelete?: (ID: number) => void
    footerComponent: JSX.Element
  }) => {
    const { totalAmount } = props

    const totalPaid = props.data.reduce((acc, payment) => {
      return acc + payment.amount
    }, 0)

    const totalPaidPercent = formatter.percentage(totalPaid, totalAmount)

    if (props.loading) {
      return <joy.Typography>Загрузка платежей...</joy.Typography>
    }

    return (
      <joy.Box>
        <joy.Table
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
              <tr key={payment.id}>
                <td>{formatter.percentage(payment.amount, totalAmount)}</td>
                <td>{formatter.money(payment.amount)}</td>
                <td>{formatter.formatOnlyDate(payment.date)}</td>
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
        </joy.Table>
      </joy.Box>
    )
  }
)

interface NewPaymentInputProps {
  order: Order
}

const NewPaymentInput = observer((props: NewPaymentInputProps) => {
  const { store } = useAppContext()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
    paymentStore.closeModal()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  async function handleSave() {
    try {
      await paymentStore.insertPayment()
      handleClose()
    } catch (error) {
      console.error('Failed to save payment:', error)
    }
  }

  function handleDateChange(v: string) {
    const date = moment(v, 'DDMMYY').toISOString()
    paymentStore.setDate(date)
  }

  function handleAmountChange(v: string) {
    const parsedValue = v.replace(',', '').replace('.', '')
    const amount = parseInt(parsedValue)
    paymentStore.setAmount(amount)
  }

  return (
    <joy.Dropdown
      open={open}
      onOpenChange={(e, open) => {
        if (open === false) {
          setAnchorEl(null)
          paymentStore.closeModal()
        } else {
          setAnchorEl(e?.target as HTMLButtonElement)
          paymentStore.openModal()
          // Set default date to today
          paymentStore.setDate(new Date().toISOString())
        }
      }}
    >
      <joy.MenuButton
        variant="outlined"
        size="sm"
        disabled={paymentStore.loading}
      >
        Добавить
      </joy.MenuButton>
      <joy.Menu
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
        <joy.Stack gap={1} p={1}>
          <Inp
            label="Дата платежа"
            placeholder="dd.mm.yy"
            onChange={v => {
              handleDateChange(v)
            }}
            defaultValue={moment().format('DD.MM.YY')}
          />
          <Row gap={1}>
            <Inp
              label="Сумма платежа"
              type="number"
              onChange={v => {
                handleAmountChange(v)
              }}
              value={paymentStore.amount?.toString() || ''}
              autoFocus
            />
            <joy.Typography>
              из {formatter.money(props.order.totalAmount)}
            </joy.Typography>
          </Row>
          {paymentStore.error && (
            <joy.Typography color="danger" level="body-sm">
              {paymentStore.error.message}
            </joy.Typography>
          )}
          <joy.Button onClick={handleSave} loading={paymentStore.loading}>
            Сохранить
          </joy.Button>
        </joy.Stack>
      </joy.Menu>
    </joy.Dropdown>
  )
})
