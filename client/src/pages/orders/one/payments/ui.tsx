/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { JSX } from '@emotion/react/jsx-runtime'
import * as joy from '@mui/joy'
import { Order, Roles } from 'domain-model'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useEffect } from 'react'
import { DeleteResourceButton, Inp, Row } from 'shortcuts'
import { GetOrderPaymentsQuery } from 'types/graphql-shema'
import * as formatter from 'utils/formatting'
import { orderStore, orderStore as os } from '../stores/order.store'

export const Paymnets = observer(({ order }: { order: Order }) => {
  const { store }: any = useAppContext()
  useEffect(() => {
    os.payments.init(order.id)
  }, [order.id])

  const isHaveFullRight = [
    Roles.general,
    Roles.management,
    Roles.bookkeeping
  ].includes(store?.user?.role)

  const paymentHistoryContent = order.totalAmount ? (
    <PaymentsTable
      data={os.payments.payments}
      onDelete={ID => os.payments.deletePayment(ID)}
      totalAmount={order.totalAmount}
      loading={os.payments.loading}
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
                {orderStore.editMode && (
                  <td>
                    <DeleteResourceButton
                      onClick={() => props?.onDelete?.(payment.id)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td> {totalPaidPercent}</td>
              <td>{!!totalPaid && formatter.money(totalPaid)}</td>
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
    os.payments.closeModal()
  }

  const open = Boolean(anchorEl)

  async function handleSave() {
    try {
      await os.payments.insertPayment()
      handleClose()
    } catch (error) {
      console.error('Failed to save payment:', error)
    }
  }

  function handleAmountChange(v: string) {
    const parsedValue = v.replace(',', '').replace('.', '')
    const amount = parseInt(parsedValue)
    os.payments.setAmount(amount)
  }

  return (
    <joy.Dropdown
      open={open}
      onOpenChange={(e, open) => {
        if (open === false) {
          setAnchorEl(null)
          os.payments.closeModal()
        } else {
          setAnchorEl(e?.target as HTMLButtonElement)
          os.payments.openModal()
        }
      }}
    >
      <joy.MenuButton
        variant="outlined"
        size="sm"
        disabled={os.payments.loading}
      >
        Добавить
      </joy.MenuButton>
      <joy.Menu
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
            placeholder="ДД.ММ.ГГ"
            onChange={v => {
              os.payments.setDate(v)
            }}
            value={os.payments.date || ''}
          />
          <Row gap={1}>
            <Inp
              label="Сумма платежа"
              type="number"
              onChange={v => {
                handleAmountChange(v)
              }}
              value={os.payments.amount?.toString() || ''}
              autoFocus
            />
            <joy.Typography>
              из {formatter.money(props.order.totalAmount)}
            </joy.Typography>
          </Row>
          {os.payments.error && (
            <joy.Typography color="danger" level="body-sm">
              {os.payments.error.message}
            </joy.Typography>
          )}
          <joy.Button onClick={handleSave} loading={os.payments.loading}>
            Сохранить
          </joy.Button>
        </joy.Stack>
      </joy.Menu>
    </joy.Dropdown>
  )
})
