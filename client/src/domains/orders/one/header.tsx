import {
  AccessTimeRounded,
  AddRounded,
  DeleteRounded,
  ErrorOutlineRounded,
  FactCheckRounded,
  LocalShippingRounded,
  LockOpenRounded,
  LockRounded,
} from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import type React from 'react'
import { useNavigate } from 'react-router'
import { OrderStatus } from 'shared'
import { type Icon, Row, text, UseIcon } from '@/lib/index'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import { TransferOrderDialog } from './dialogs/transfer-order.dialog'
import { orderStore } from './order.store'

export type ActionButton = {
  tip: string
  handler?: () => void
  icon: Icon
  hidden?: boolean
  dialog?: React.ElementType
  dialogHandler?: () => void
}

const ActionButton = observer((props: { buttons: ActionButton[] }) => {
  const { buttons } = props
  const renderResult = buttons
    .filter(btn => !btn.hidden)
    .map(btn => {
      const btnComponent = (
        <Tooltip title={btn.tip} key={btn.tip}>
          <IconButton
            variant="soft"
            color="primary"
            data-tip={btn.tip}
            onClick={btn.handler}
          >
            <UseIcon icon={btn.icon} />
          </IconButton>
        </Tooltip>
      )

      return btn.dialog ? (
        <btn.dialog handler={btn.dialogHandler} key={btn.tip}>
          {btnComponent}
        </btn.dialog>
      ) : (
        btnComponent
      )
    })

  if (!renderResult.length) return null
  return <Row gap={1}>{renderResult}</Row>
})

const SwitchOrderStatusBtn = observer(() => {
  const status = orderStore.order?.status
  if (!status) return null

  const statusButtons: ActionButton[] = [
    {
      tip: text.orderRequiresSpectialAttention,
      handler: () => orderStore.updateNeedAttention(),
      icon: ErrorOutlineRounded,
    },
    {
      tip: text.orderReadyForDispatch,
      handler: () => orderStore.updateAwaitingDispatch(),
      icon: AccessTimeRounded,
      hidden: ![
        OrderStatus.InProduction,
        OrderStatus.ReclamationInProduction,
      ].includes(status),
    },
  ]

  return <ActionButton buttons={statusButtons} />
})

export const OrderActions = observer(() => {
  const navigate = useNavigate()
  const status = orderStore.order?.status
  if (!status) return null

  const buttons: ActionButton[] = [
    {
      tip: text.moveToPriority,
      handler: () => orderStore.moveToPriority(),
      icon: FactCheckRounded,
      hidden: ![OrderStatus.PreOrder].includes(status),
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => orderStore.moveToArchive(OrderStatus.Archived),
      tip: text.orderCompleted,
      icon: LocalShippingRounded,
      hidden: ![OrderStatus.InProduction].includes(status),
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () =>
        orderStore.moveToArchive(OrderStatus.ReclamationArchived),
      tip: text.orderCompleted,
      icon: LocalShippingRounded,
      hidden: ![OrderStatus.ReclamationInProduction].includes(status),
    },
    {
      dialog: DeleteOrderDialog,
      dialogHandler: async () => {
        await orderStore.deleteOrder()
        navigate(-1)
      },
      tip: text.delete,
      icon: DeleteRounded,
      hidden: ![
        OrderStatus.PreOrder,
        OrderStatus.InProduction,
        OrderStatus.ReclamationIncoming,
        OrderStatus.ReclamationDecision,
        OrderStatus.ReclamationInProduction,
      ].includes(status),
    },
    {
      tip: text.addPosition,
      handler: () => {
        orderStore.positions.openDialog()
      },
      icon: AddRounded,
      hidden: [OrderStatus.Archived, OrderStatus.ReclamationArchived].includes(
        status,
      ),
    },
    {
      tip: text.change,
      handler: () => {
        orderStore.switchEditMode()
      },
      icon: orderStore.editMode ? LockOpenRounded : LockRounded,
    },
  ]

  return (
    <Row>
      <Row>
        <SwitchOrderStatusBtn />
      </Row>
      {<ActionButton buttons={buttons} />}
    </Row>
  )
})
