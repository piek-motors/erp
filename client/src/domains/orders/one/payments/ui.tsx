/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { JSX } from '@emotion/react/jsx-runtime'
import { UilPlusCircle } from '@iconscout/react-unicons'
import { Box, Button, Dropdown, Menu, MenuButton, Stack, Table } from '@mui/joy'
import { DateInput } from 'components/inputs/date_input'
import { MoneyInput } from 'components/inputs/money-input'
import type { UnpackedOrder } from 'domains/orders/api'
import { useEscapeClose } from 'hooks/use-escape-close'
import { DeleteResourceButton, Label, P, Row, UseIcon } from 'lib/index'
import { formatOnlyDate } from 'lib/utils/date_fmt'
import { formatMoney, percentage } from 'lib/utils/fmt'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Payment } from 'srv/domains/orders/payments_rpc'
import { orderStore, orderStore as os } from '../order.store'

export const Paymnets = observer(({ order }: { order: UnpackedOrder }) => {
  const paymentHistoryContent = order.total_amount ? (
    <PaymentsTable
      data={os.payments.payments.map(p => ({
        id: p.id,
        order_id: order.id,
        amount: p.amount,
        date: p.date,
      }))}
      onDelete={ID => os.payments.deletePayment(ID)}
      totalAmount={order.total_amount}
      loading={os.payments.loading}
      footerComponent={<NewPaymentInput order={order} />}
    />
  ) : (
    <P level="body-xs" color="danger">
      Не задана сумма заказа
    </P>
  )
  return (
    <Box my={1}>
      <Label>Платежи</Label>
      {paymentHistoryContent}
    </Box>
  )
})

const PaymentsTable = observer(
  (props: {
    data: Payment[]
    totalAmount: number
    loading: boolean
    onDelete?: (ID: number) => void
    footerComponent: JSX.Element
  }) => {
    const { totalAmount } = props

    const totalPaid = props.data.reduce((acc, payment) => {
      return acc + Number(payment.amount)
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
            {!!props.data.length &&
              props.data.map(payment => (
                <tr key={payment.id}>
                  <td>{percentage(payment.amount, totalAmount)}</td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>{formatOnlyDate(payment.date.toISOString())}</td>
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
              <td>
                {!!totalPaid && 'Σ'} {!!totalPaid && formatMoney(totalPaid)}
              </td>
              {props.footerComponent && <td>{props.footerComponent}</td>}
            </tr>
          </tfoot>
        </Table>
      </Box>
    )
  },
)

interface NewPaymentInputProps {
  order: UnpackedOrder
}

const NewPaymentInput = observer((props: NewPaymentInputProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
    os.payments.closeModal()
  }

  const open = Boolean(anchorEl)

  const handleSave = async () => {
    try {
      await os.payments.insertPayment(props.order)
      handleClose()
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      alert(`Не удалось сохранить платеж: ${msg}`)
    }
  }

  useEscapeClose(open, handleClose)

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
      <MenuButton
        variant="soft"
        color="primary"
        size="sm"
        disabled={os.payments.loading}
      >
        <UseIcon icon={UilPlusCircle} />
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
          <Row gap={1} alignItems={'end'}>
            <MoneyInput
              label="Сумма платежа"
              onChange={v => os.payments.setAmount(v)}
              value={os.payments.amount}
              autoFocus
            />
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => {
                os.payments.setAmount(props.order.total_amount ?? 0)
              }}
            >
              <P>из {formatMoney(props.order.total_amount ?? 0)}</P>
            </Button>
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
