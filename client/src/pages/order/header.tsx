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
import { useNavigate } from 'react-router-dom'
import { OrderStatus } from 'shared'
import { useOrderDetailStore } from 'src/pages/order/state'
import { TOrder } from 'src/types/global'
import {
  useDeleteOrderMutation,
  useMoveOrderToArchiveMutation,
  useMoveOrderToPriorityMutation,
  useUpdateAwaitingDispatchMutation,
  useUpdateNeedAttentionMutation
} from 'src/types/graphql-shema'
import { ICON_OPACITY, ICON_WIDTH, Row, text } from '../../shortcuts'
import { useNotifier } from '../../store/notifier.store'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import { TransferOrderDialog } from './dialogs/transfer-order.dialog'

interface IStatusButtonsProps {
  order: TOrder
  renderAlg: any
}

function SwitchOrderStatusBtn({ order, renderAlg }: IStatusButtonsProps) {
  const [mutationAwaitingDispatch] = useUpdateAwaitingDispatchMutation()
  const [mutationNeedAttention] = useUpdateNeedAttentionMutation()
  return renderAlg([
    {
      tip: text.orderRequiresSpectialAttention,
      handler: () =>
        mutationNeedAttention({
          variables: {
            OrderID: order.OrderID,
            NeedAttention: order.NeedAttention === 'true' ? 'false' : 'true'
          }
        }),
      icon: UilExclamationTriangle
    },
    {
      tip: text.orderReadyForDispatch,
      handler: () =>
        mutationAwaitingDispatch({
          variables: {
            OrderID: order.OrderID,
            AwaitingDispatch: !order.AwaitingDispatch
          },
          optimisticResponse: {
            update_erp_Orders_by_pk: {
              __typename: 'erp_Orders',
              ...order,
              AwaitingDispatch: !order.AwaitingDispatch
            }
          }
        }),
      icon: UilClockThree,
      hidden: ![OrderStatus.ordProduction, OrderStatus.reclProduction].includes(
        order.OrderStatusID
      )
    }
  ])
}

export function OrderActions({ order }: { order: TOrder }) {
  const {
    orderId,
    editMode,
    setEditMode,
    setAddOrderItemDialog,
    setEditedOrderItem
  } = useOrderDetailStore()

  const [mutationMoveOrderToArchive] = useMoveOrderToArchiveMutation()
  const [mutationMoveOrderToPriority] = useMoveOrderToPriorityMutation()
  const [mutationDeleteOrder] = useDeleteOrderMutation()

  const navigate = useNavigate()
  const notifier = useNotifier()

  const getResource = () => {
    if (
      [
        OrderStatus.reclDecision,
        OrderStatus.reclInbox,
        OrderStatus.reclProduction
      ].includes(order.OrderStatusID)
    )
      return '/reclamation'

    return '/'
  }

  async function orderCompleted(OrderStatusID: number) {
    if (!orderId) throw Error('orderId is null')
    mutationMoveOrderToArchive({
      variables: {
        OrderID: orderId,
        ActualShippingDate: new Date(),
        OrderStatusID
      }
    }).then(res => {
      if (res.errors) throw new Error(res.errors.toString())
      notifier.notify('info', 'Заказ перенесен в архив')
    })
  }

  // Перекидывает предзаказ в очередность
  async function transferOrderToPriority() {
    if (!orderId) throw Error('orderId is null')

    const res = await mutationMoveOrderToPriority({
      variables: {
        OrderID: orderId,
        AcceptanceDate: new Date()
      }
    })
    if (res.errors) throw new Error(res.errors.toString())
    notifier.notify('info', 'Заказ внесен в очередность выполнения')
  }

  // для удаления заказа
  function mutationDeleteOrderHandler() {
    if (!orderId) throw Error('orderId is null')

    mutationDeleteOrder({
      variables: {
        OrderID: orderId
      }
    }).then(res => {
      if (res.errors) throw new Error(res.errors.toString())

      navigate(getResource())
    })
  }

  const buttons: ActionButton[] = [
    {
      tip: text.moveToPriority,
      handler: transferOrderToPriority,
      icon: UilFileCheck,
      hidden: ![OrderStatus.ordRegistration].includes(order.OrderStatusID)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => orderCompleted(3),
      tip: text.orderCompleted,
      icon: UilTruck,
      hidden: ![OrderStatus.ordProduction].includes(order.OrderStatusID)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => orderCompleted(13),
      tip: text.orderCompleted,
      icon: UilTruck,
      hidden: ![OrderStatus.reclProduction].includes(order.OrderStatusID)
    },
    {
      dialog: DeleteOrderDialog,
      dialogHandler: mutationDeleteOrderHandler,
      tip: text.delete,
      icon: UilTrashAlt,
      hidden: ![
        OrderStatus.ordRegistration,
        OrderStatus.ordProduction,
        OrderStatus.reclInbox,
        OrderStatus.reclDecision,
        OrderStatus.reclInbox
      ].includes(order.OrderStatusID)
    },
    {
      tip: text.addPosition,
      handler: () => {
        setEditedOrderItem(null)
        setAddOrderItemDialog(true)
      },
      icon: UilPlus,
      hidden: [OrderStatus.ordArchived, OrderStatus.reclArchived].includes(
        order.OrderStatusID
      )
    },
    {
      tip: text.change,
      handler: () => setEditMode(!editMode),
      icon: editMode ? UilUnlock : UilLock
    }
  ]

  return (
    <Row>
      <Row>
        <SwitchOrderStatusBtn order={order} renderAlg={ActionButton} />
      </Row>
      {ActionButton(buttons)}
    </Row>
  )
}

export type ActionButton = {
  tip: string
  handler?: () => void
  icon: Icon
  hidden?: boolean
  dialog?: React.ElementType
  dialogHandler?: () => void
}

function ActionButton(arrayOfBtns: ActionButton[]) {
  const renderResult = arrayOfBtns.map(each => {
    if (each.hidden) return <></>

    const btnComponent = (
      <Tooltip title={each.tip}>
        <IconButton
          variant="soft"
          color="neutral"
          key={each.tip}
          data-tip={each.tip}
          onClick={each.handler}
        >
          <each.icon width={ICON_WIDTH} opacity={ICON_OPACITY} />
        </IconButton>
      </Tooltip>
    )

    return each.dialog ? (
      <each.dialog handler={each.dialogHandler} key={each.tip}>
        {btnComponent}
      </each.dialog>
    ) : (
      btnComponent
    )
  })

  if (!renderResult.filter(each => each).length) return null
  return <Row gap={1}>{renderResult.filter(each => each)}</Row>
}
