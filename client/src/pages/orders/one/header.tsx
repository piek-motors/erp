import * as icons from '@iconscout/react-unicons'
import { IconButton, Tooltip } from '@mui/joy'
import { OrderStatus } from 'domain-model'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, text, UseIcon } from 'shortcuts'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import { TransferOrderDialog } from './dialogs/transfer-order.dialog'
import { orderStore } from './stores/order.store'

export type ActionButton = {
  tip: string
  handler?: () => void
  icon: icons.Icon
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
            color="neutral"
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
  const statusButtons: ActionButton[] = [
    {
      tip: text.orderRequiresSpectialAttention,
      handler: () => orderStore.updateNeedAttention(),
      icon: icons.UilExclamationTriangle
    },
    {
      tip: text.orderReadyForDispatch,
      handler: () => orderStore.updateAwaitingDispatch(),
      icon: icons.UilClockThree,
      hidden: ![
        OrderStatus.InProduction,
        OrderStatus.ReclamationInProduction
      ].includes(orderStore.order?.status)
    }
  ]

  return <ActionButton buttons={statusButtons} />
})

export const OrderActions = observer(() => {
  const navigate = useNavigate()
  const status = orderStore.order?.status
  const buttons: ActionButton[] = [
    {
      tip: text.moveToPriority,
      handler: () => orderStore.moveToPriority(),
      icon: icons.UilFileCheck,
      hidden: ![OrderStatus.PreOrder].includes(status)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => orderStore.moveToArchive(OrderStatus.Archived),
      tip: text.orderCompleted,
      icon: icons.UilTruck,
      hidden: ![OrderStatus.InProduction].includes(orderStore.order?.status)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () =>
        orderStore.moveToArchive(OrderStatus.ReclamationArchived),
      tip: text.orderCompleted,
      icon: icons.UilTruck,
      hidden: ![OrderStatus.ReclamationInProduction].includes(status)
    },
    {
      dialog: DeleteOrderDialog,
      dialogHandler: async () => {
        await orderStore.deleteOrder()
        navigate(-1)
      },
      tip: text.delete,
      icon: icons.UilTrashAlt,
      hidden: ![
        OrderStatus.PreOrder,
        OrderStatus.InProduction,
        OrderStatus.ReclamationIncoming,
        OrderStatus.ReclamationDecision,
        OrderStatus.ReclamationInProduction
      ].includes(status)
    },
    {
      tip: text.addPosition,
      handler: () => {
        orderStore.positions.openDialog()
      },
      icon: icons.UilPlus,
      hidden: [OrderStatus.Archived, OrderStatus.ReclamationArchived].includes(
        status
      )
    },
    {
      tip: text.change,
      handler: () => {
        orderStore.switchEditMode()
      },
      icon: orderStore.editMode ? icons.UilUnlock : icons.UilLock
    }
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
