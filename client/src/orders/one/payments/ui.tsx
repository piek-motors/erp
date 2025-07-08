/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { JSX } from '@emotion/react/jsx-runtime'
import { Box, Button, Dropdown, Menu, MenuButton, Stack, Table } from '@mui/joy'
import { DateInput } from 'components/inputs/date_input'
import { MoneyInput } from 'components/money-input'
import { Order, UserRole } from 'domain-model'
import { useAppContext } from 'hooks'
import { DeleteResourceButton, P, Row } from 'lib/index'
import { GetOrderPaymentsQuery } from 'lib/types/graphql-shema'
import { formatMoney, formatOnlyDate, percentage } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { orderStore, orderStore as os } from '../stores/order.store'

export const Paymnets = observer(({ order }: { order: Order }) => {
  const { store }: any = useAppContext()

  const isHaveFullRight = [
    UserRole.Admin,
    UserRole.OrderManager,
    UserRole.Bookkeeper
  ].includes(store?.user?.role)

  const paymentHistoryContent = order.totalAmount ? (
    <PaymentsTable
      data={os.payments.payments}
      onDelete={ID => os.payments.deletePayment(ID)}
      totalAmount={order.totalAmount}
      loading={os.payments.loading}
      footerComponent={
        <Box>{isHaveFullRight && <NewPaymentInput order={order} />}</Box>
      }
    />
  ) : (
    <P level="body-xs" color="danger">
      Не задана сумма заказа
    </P>
  )

  return (
    <Box my={1}>
      <P>
        Платежи <P level="body-xs">[{os.payments.payments.length}]</P>
      </P>
      {paymentHistoryContent}
    </Box>
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

    const totalPaidPercent = percentage(totalPaid, totalAmount)

    if (props.loading) {
      return <P>Загрузка платежей...</P>
    }

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
            {props.data.length > 1 &&
              props.data.map(payment => (
                <tr key={payment.id}>
                  <td>{percentage(payment.amount, totalAmount)}</td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>{formatOnlyDate(payment.date)}</td>
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
              <td>{!!totalPaid && formatMoney(totalPaid)}</td>
              {props.footerComponent && <td>{props.footerComponent}</td>}
            </tr>
          </tfoot>
        </Table>
      </Box>
    )
  }
)

interface NewPaymentInputProps {
  order: Order
}

const NewPaymentInput = observer((props: NewPaymentInputProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
    os.payments.closeModal()
  }

  const open = Boolean(anchorEl)

  async function handleSave() {
    try {
      await os.payments.insertPayment(props.order)
      handleClose()
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      alert(`Не удалось сохранить платеж: ${msg}`)
    }
  }

  function handleAmountChange(v: number) {
    os.payments.setAmount(v)
  }

  return (
    <Dropdown
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
      <MenuButton variant="outlined" size="sm" disabled={os.payments.loading}>
        Добавить
      </MenuButton>
      <Menu
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
          <DateInput
            label="Дата платежа"
            value={os.payments.date || ''}
            onChange={v => os.payments.setDate(v)}
          />
          <Row gap={1}>
            <MoneyInput
              label="Сумма платежа"
              onChange={handleAmountChange}
              value={os.payments.amount}
              autoFocus
            />
            <P>из {formatMoney(props.order.totalAmount)}</P>
          </Row>
          {os.payments.error && (
            <P color="danger" level="body-sm">
              {os.payments.error.message}
            </P>
          )}
          <Button onClick={handleSave} loading={os.payments.loading}>
            Сохранить
          </Button>
        </Stack>
      </Menu>
    </Dropdown>
  )
})
