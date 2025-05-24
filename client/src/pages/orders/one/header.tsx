/** @jsxImportSource @emotion/react */
import {
  Icon,
  UilClockThree,
  UilExclamationTriangle,
  UilFileCheck,
  UilLock,
  UilPlus,
  UilTrashAlt,
  UilTruck,
  UilUnlock
} from '@iconscout/react-unicons'
import { IconButton, Tooltip } from '@mui/joy'
import { Order, OrderStatus } from 'domain-model'
import { Observer } from 'mobx-react-lite'
import { useOrderDetailStore } from 'pages/orders/one/state'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, text, UseIcon } from 'shortcuts'
import { useNotifier } from 'store/notifier.store'
import { TOrder } from 'types/global'
import {
  useDeleteOrderMutation,
  useMoveOrderToArchiveMutation,
  useMoveOrderToPriorityMutation,
  useUpdateAwaitingDispatchMutation,
  useUpdateNeedAttentionMutation
} from 'types/graphql-shema'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import { TransferOrderDialog } from './dialogs/transfer-order.dialog'
import { orderStore } from './order.store'

// Types
export type ActionButton = {
  tip: string
  handler?: () => void
  icon: Icon
  hidden?: boolean
  dialog?: React.ElementType
  dialogHandler?: () => void
}

interface IStatusButtonsProps {
  order: TOrder
}

// Custom hook for order mutations
function useOrderMutations(orderId: number | null) {
  const [mutationMoveOrderToArchive] = useMoveOrderToArchiveMutation()
  const [mutationMoveOrderToPriority] = useMoveOrderToPriorityMutation()
  const [mutationDeleteOrder] = useDeleteOrderMutation()
  const [mutationAwaitingDispatch] = useUpdateAwaitingDispatchMutation()
  const [mutationNeedAttention] = useUpdateNeedAttentionMutation()
  const notifier = useNotifier()
  const navigate = useNavigate()

  const handleError = (error: Error) => {
    notifier.notify('err', error.message)
  }

  const moveToArchive = async (OrderStatusID: number) => {
    if (!orderId) throw Error('orderId is null')
    try {
      const res = await mutationMoveOrderToArchive({
        variables: {
          id: orderId,
          actual_shipping_date: new Date(),
          status: OrderStatusID
        }
      })
      if (res.errors) throw new Error(res.errors.toString())
      notifier.notify('info', 'Заказ перенесен в архив')
    } catch (error) {
      handleError(error as Error)
    }
  }

  const moveToPriority = async () => {
    if (!orderId) throw Error('orderId is null')
    try {
      const res = await mutationMoveOrderToPriority({
        variables: {
          id: orderId,
          acceptance_date: new Date()
        }
      })
      if (res.errors) throw new Error(res.errors.toString())
      notifier.notify('info', 'Заказ внесен в очередность выполнения')
    } catch (error) {
      handleError(error as Error)
    }
  }

  const deleteOrder = async (redirectPath: string) => {
    if (!orderId) throw Error('orderId is null')
    try {
      const res = await mutationDeleteOrder({
        variables: { id: orderId }
      })
      if (res.errors) throw new Error(res.errors.toString())
      navigate(redirectPath)
    } catch (error) {
      handleError(error as Error)
    }
  }

  const updateAwaitingDispatch = async (order: Order) => {
    try {
      await mutationAwaitingDispatch({
        variables: {
          id: order.id,
          awaiting_dispatch: !order.awatingDispatch
        },
        optimisticResponse: {
          update_orders_orders_by_pk: {
            __typename: 'orders_orders',
            ...order,
            id: order.id,
            awaiting_dispatch: !order.awatingDispatch
          }
        }
      })
    } catch (error) {
      handleError(error as Error)
    }
  }

  const updateNeedAttention = async (order: Order) => {
    try {
      await mutationNeedAttention({
        variables: {
          id: order.id,
          need_attention: order.needAttention ? 'true' : 'false'
        }
      })
    } catch (error) {
      handleError(error as Error)
    }
  }

  return {
    moveToArchive,
    moveToPriority,
    deleteOrder,
    updateAwaitingDispatch,
    updateNeedAttention
  }
}

// Button rendering component
const ActionButton = (props: { buttons: ActionButton[] }) => {
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
}

function SwitchOrderStatusBtn({ order }: { order: Order }) {
  const { updateAwaitingDispatch, updateNeedAttention } = useOrderMutations(
    order.id
  )

  const statusButtons: ActionButton[] = [
    {
      tip: text.orderRequiresSpectialAttention,
      handler: () => updateNeedAttention(order),
      icon: UilExclamationTriangle
    },
    {
      tip: text.orderReadyForDispatch,
      handler: () => updateAwaitingDispatch(order),
      icon: UilClockThree,
      hidden: ![
        OrderStatus.InProduction,
        OrderStatus.ReclamationInProduction
      ].includes(order.status)
    }
  ]

  return <ActionButton buttons={statusButtons} />
}

export function OrderActions({ order }: { order: Order }) {
  const { orderId, setAddOrderItemDialog, setEditedOrderItem } =
    useOrderDetailStore()

  const { moveToArchive, moveToPriority, deleteOrder } =
    useOrderMutations(orderId)

  const getResource = () => {
    if (
      [
        OrderStatus.ReclamationDecision,
        OrderStatus.ReclamationIncoming,
        OrderStatus.ReclamationInProduction
      ].includes(order.status)
    )
      return '/reclamation'
    return '/'
  }

  return (
    <Observer
      render={() => {
        const buttons: ActionButton[] = [
          {
            tip: text.moveToPriority,
            handler: moveToPriority,
            icon: UilFileCheck,
            hidden: ![OrderStatus.PreOrder].includes(order.status)
          },
          {
            dialog: TransferOrderDialog,
            dialogHandler: () => moveToArchive(3),
            tip: text.orderCompleted,
            icon: UilTruck,
            hidden: ![OrderStatus.InProduction].includes(order.status)
          },
          {
            dialog: TransferOrderDialog,
            dialogHandler: () => moveToArchive(13),
            tip: text.orderCompleted,
            icon: UilTruck,
            hidden: ![OrderStatus.ReclamationInProduction].includes(
              order.status
            )
          },
          {
            dialog: DeleteOrderDialog,
            dialogHandler: () => deleteOrder(getResource()),
            tip: text.delete,
            icon: UilTrashAlt,
            hidden: ![
              OrderStatus.PreOrder,
              OrderStatus.InProduction,
              OrderStatus.ReclamationIncoming,
              OrderStatus.ReclamationDecision,
              OrderStatus.ReclamationInProduction
            ].includes(order.status)
          },
          {
            tip: text.addPosition,
            handler: () => {
              setEditedOrderItem(null)
              setAddOrderItemDialog(true)
            },
            icon: UilPlus,
            hidden: [
              OrderStatus.Archived,
              OrderStatus.ReclamationArchived
            ].includes(order.status)
          },
          {
            tip: text.change,
            handler: () => {
              orderStore.switchEditMode()
            },
            icon: orderStore.editMode ? UilUnlock : UilLock
          }
        ]

        return (
          <Row>
            <Row>
              <SwitchOrderStatusBtn order={order} />
            </Row>
            {<ActionButton buttons={buttons} />}
          </Row>
        )
      }}
    />
  )
}
