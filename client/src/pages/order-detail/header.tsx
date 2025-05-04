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
import { Button, Tooltip } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { OrderStatus, TOrder, UserStatus } from 'src/types/global'
import {
  useDeleteOrderMutation,
  useMoveOrderToArchiveMutation,
  useMoveOrderToPriorityMutation,
  useUpdateAwaitingDispatchMutation,
  useUpdateNeedAttentionMutation
} from 'src/types/graphql-shema'
import { emitNotification } from 'src/utils/notification'
import { Row } from '../../shortcuts'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import { TransferOrderDialog } from './dialogs/transfer-order.dialog'

interface IStatusButtonsProps {
  order: TOrder
  renderAlg: any
}

function StatusButtons({ order, renderAlg }: IStatusButtonsProps) {
  const [mutationAwaitingDispatch] = useUpdateAwaitingDispatchMutation()
  const [mutationNeedAttention] = useUpdateNeedAttentionMutation()

  // При статусе "требует внимания" происходит выделение заказа красным цветом в очередности.
  // В левом меню в информации о заказе фиксируется  дата включения этого статуса.
  // Желательно чтобы возможность снятия была только у определенных аккаунтов .
  // Это необходимо когда при открытии заказа выясняется дефицит комплектующих или по заказу требуются срочные уточнения от заказчика какие-нибудь.
  function needAttentionHandler() {
    const curDate = new Date().toISOString()
    var payload: any = []
    if (!order.NeedAttention) payload = ['true', curDate, 'null']
    else {
      const nd = order.NeedAttention.split(',')
      if (nd[0] === 'true') payload = ['false', nd[1], curDate]
      if (nd[0] === 'false') payload = ['true', curDate, 'null']
    }

    mutationNeedAttention({
      variables: {
        OrderID: order.OrderID,
        NeedAttention: payload.join(',')
      }
      // optimisticResponse: {
      //     erp_Orders: {
      //         __typename: 'erp_Orders',
      //         OrderID: order.OrderID,
      //         NeedAttention: payload.join(',')
      //     }
      //     }
    })
  }
  // При статусе "ожидает отгрузки" происходит
  //  выделение зеленым цветом в очередности, что означает, что заказ уже собран,
  // и не отгружается по бумажным причинам
  function awaitingDispatchHandler() {
    mutationAwaitingDispatch({
      variables: {
        OrderID: order.OrderID,
        AwaitingDispatch: !order.AwaitingDispatch
      },
      optimisticResponse: {
        update_erp_Orders_by_pk: {
          __typename: 'erp_Orders',
          // OrderID: order.OrderID,
          ...order,
          AwaitingDispatch: !order.AwaitingDispatch
        }
      }
    })
  }

  const needAttention = order.NeedAttention?.split(',')[0] === 'true'

  const statusButtons: ActionButton[] = [
    {
      tip: 'Требует внимания',
      handler: needAttentionHandler,
      icon: UilExclamationTriangle,
      className: needAttention ? 'active' : ' ',
      userRight: true
    },
    {
      tip: 'Готов к отгрузке',
      handler: awaitingDispatchHandler,
      icon: UilClockThree,
      className: order.AwaitingDispatch ? 'active' : '',
      userRight: true,
      hidden: ![OrderStatus.ordProduction, OrderStatus.reclProduction].includes(
        order.OrderStatusID
      )
    }
  ]

  return renderAlg(statusButtons)
}

export type ActionButton = {
  tip: string
  handler?: () => void
  icon: Icon
  className?: string
  userRight: boolean
  hidden?: boolean
  dialog?: React.ElementType
  dialogHandler?: () => void
}

function ActionButtonsRender(arrayOfBtns: ActionButton[]) {
  const renderResult = arrayOfBtns.map(each => {
    if (each.hidden) return <div key={each.tip}></div>

    const btnComponent = (
      <Tooltip title={each.tip}>
        <Button
          variant="soft"
          color="neutral"
          key={each.tip}
          data-tip={each.tip}
          onClick={each.handler}
          className={each.className}
          disabled={!each.userRight}
        >
          <each.icon />
        </Button>
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

export function OrderActions({ order }: { order: TOrder }) {
  const { store }: any = useAppContext()
  const {
    orderId,
    editMode,
    setEditMode,
    setAddOrderItemDialog,
    setEditedOrderItem
  } = useOrderDetailStore()

  const isHaveFullRight = [
    UserStatus.general,
    UserStatus.management,
    UserStatus.bookkeeping
  ].includes(store.user.AccessLevelID)

  const [mutationMoveOrderToArchive] = useMoveOrderToArchiveMutation()
  const [mutationMoveOrderToPriority] = useMoveOrderToPriorityMutation()
  const [mutationDeleteOrder] = useDeleteOrderMutation()

  const navigate = useNavigate()

  const baseurl = () => {
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

  // Перекидывает заказ в архив (убирает из очередности)
  async function transferOrderToArchive(OrderStatusID: number) {
    if (!orderId) throw Error('orderId is null')

    mutationMoveOrderToArchive({
      variables: {
        OrderID: orderId,
        ActualShippingDate: new Date(),
        OrderStatusID
      }
    }).then(res => {
      if (res.errors) throw new Error(res.errors.toString())
      emitNotification('success', 'Заказ перенесен в архив')
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
    emitNotification('success', 'Заказ внесен в очередность выполнения')
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

      navigate(baseurl())
    })
  }

  const buttons: ActionButton[] = [
    {
      tip: 'В очередность',
      handler: transferOrderToPriority,
      icon: UilFileCheck,
      userRight: isHaveFullRight,
      hidden: ![OrderStatus.ordRegistration].includes(order.OrderStatusID)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => transferOrderToArchive(3),
      tip: 'Закрыть заказ',
      icon: UilTruck,
      userRight: true,
      hidden: ![OrderStatus.ordProduction].includes(order.OrderStatusID)
    },
    {
      dialog: TransferOrderDialog,
      dialogHandler: () => transferOrderToArchive(13),
      tip: 'Закрыть рекламацию',
      icon: UilTruck,
      userRight: true,
      hidden: ![OrderStatus.reclProduction].includes(order.OrderStatusID)
    },
    {
      dialog: DeleteOrderDialog,
      dialogHandler: mutationDeleteOrderHandler,
      tip: 'Удалить заказ',
      icon: UilTrashAlt,
      userRight: isHaveFullRight,
      hidden: ![
        OrderStatus.ordRegistration,
        OrderStatus.ordProduction,
        OrderStatus.reclInbox,
        OrderStatus.reclDecision,
        OrderStatus.reclInbox
      ].includes(order.OrderStatusID)
    },
    {
      tip: 'Добавить позицию',
      handler: () => {
        setEditedOrderItem(null)
        setAddOrderItemDialog(true)
      },
      icon: UilPlus,
      userRight: isHaveFullRight,
      hidden: [OrderStatus.ordArchived, OrderStatus.reclArchived].includes(
        order.OrderStatusID
      )
    },
    {
      tip: 'Поменять что-то',
      handler: () => setEditMode(!editMode),
      icon: editMode ? UilUnlock : UilLock,
      userRight: isHaveFullRight
    }
  ]

  return (
    <Row>
      <Row>
        <StatusButtons order={order} renderAlg={ActionButtonsRender} />
      </Row>
      {ActionButtonsRender(buttons)}
    </Row>
  )
}
