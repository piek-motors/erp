import { Box, Chip, type ChipProps, Divider } from '@mui/joy'
import { AttachmentComponent } from 'components/attachments/attachment'
import { NumberInput } from 'components/inputs/number_input'
import { InModal } from 'components/modal'
import { EnumSelect } from 'components/select'
import { PrintOnly, WebOnly } from 'components/utilities/conditional-display'
import { DetailName } from 'domains/pdo/detail/detail_name'
import {
  Button,
  DeleteResourceButton,
  Label,
  Loading,
  observer,
  openPage,
  P,
  routeMap,
  Row,
  RowWithDividers,
  SaveIconButton,
  Stack,
  useEffect,
  useNavigate,
  useParams,
  useState,
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { fmtDate, timeDeltaDays } from 'lib/utils/date_fmt'
import {
  OrderPriority,
  ManufacturingOrderStatus as OrderStatus,
  uiManufacturingOrderStatus,
  UiOrderPriority,
} from 'models'
import { app_cache } from '../cache'
import type { DetailSt, DetailStProp } from '../detail/detail.state'
import { DetailBlankSt } from '../detail/detail_blank.store'
import { MetalPageTitle } from '../shared/basic'
import { DetailBlank } from './detail_blank'
import { OrderSt, type OrderStProp } from './order.state'
import { api } from './order_api'
import { TechPassportTable } from './tech_passport/passport_table'
import { ProductionRoute } from './tech_passport/production_route_table'
import { DetailDescription } from './tech_passport/shared'

const deletionAllowed = [
  OrderStatus.Waiting,
  OrderStatus.Preparation,
  OrderStatus.Production,
]

export const OrderUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()

  const [detail, setDetail] = useState<DetailSt | null>(null)
  const [order] = useState(() => new OrderSt())

  useEffect(() => {
    if (id) {
      api.load(Number(id)).then(res => {
        setDetail(res.detail)
        order.setOrder(res.order)
      })
    }
  }, [id])

  if (!detail || api.loader.loading || order.isLoading()) {
    return <Loading />
  }

  if (!order.resp) {
    return <div>Заказ не найден</div>
  }

  const isDeletionAllowed = deletionAllowed.includes(order.status)

  return (
    <Stack gap={1}>
      <WebOnly>
        <Stack gap={1} justifyContent={'space-between'} width={'100%'}>
          <MetalPageTitle
            t={
              <Box width={'max-content'}>
                <Row>
                  <P level="body-sm" whiteSpace={'nowrap'}>
                    Заказ №{order.id}
                  </P>
                  <OrderStatusChip status={order.resp.status} />
                </Row>
                <DetailName detail={detail} withGroupName />
              </Box>
            }
          />
          <Divider />
          <RowWithDividers gap={2} alignItems={'start'}>
            <ProductionSteps order={order} detail={detail} />
            <Stack spacing={1}>
              <QuantityInput
                order={order}
                recBatchSize={detail.recommendedBatchSize}
              />
              <Divider />
              <OrderPrioritySelect order={order} />
              <TechPassportButton order={order} />
            </Stack>
            <BlankDisplay blank={detail?.blank} order={order} />
            <DetailAttachments detail={detail} />
            <DetailDescription htmlContent={detail.description} />
          </RowWithDividers>
          <Divider />
          <Dates order={order} />
          <Row
            justifyContent={
              [OrderStatus.Production, OrderStatus.Collected].includes(
                order.status,
              )
                ? 'end'
                : 'start'
            }
          >
            {api.loader.loading && <Loading />}
            <ActionButton order={order} />
            {isDeletionAllowed && <DeleteOrderButton order={order} />}
          </Row>
        </Stack>
        <DuplicationCheckModal order={order} />
      </WebOnly>

      <PrintOnly display="block">
        <PrintingPageVerion order={order} detail={detail} />
      </PrintOnly>
    </Stack>
  )
})

const OrderStatusChip = ({ status }: { status: OrderStatus }) => {
  let color: ChipProps['color'] = 'neutral'
  switch (status) {
    case OrderStatus.Production:
      color = 'primary'
      break
    case OrderStatus.Collected:
      color = 'success'
      break
  }
  return (
    <Chip color={color} variant="solid" size="sm">
      {uiManufacturingOrderStatus(status)}
    </Chip>
  )
}

const ProductionSteps = observer(
  ({ detail, order }: DetailStProp & OrderStProp) => {
    if (
      detail.processingRoute.steps.length === 0 ||
      order.status == OrderStatus.Collected
    )
      return null
    return (
      <Stack>
        <Label label="Этапы обработки" />
        {detail.processingRoute.steps.map((operation, operation_index) => {
          const current = order.currentOperation === operation_index
          const timedelta =
            current &&
            order.resp?.current_operation_start_at &&
            timeDeltaDays(order.resp.current_operation_start_at)
          return (
            <Row>
              <Button
                size="sm"
                key={operation.name}
                variant={current ? 'solid' : 'plain'}
                sx={{ width: 'fit-content', textAlign: 'left' }}
                color={current ? 'success' : 'neutral'}
                onClick={() => api.setCurrentOperation(order, operation_index)}
              >
                {operation.name}
              </Button>
              <Label>{timedelta}</Label>
            </Row>
          )
        })}
      </Stack>
    )
  },
)

const BlankDisplay = observer(
  ({ blank, order }: { blank?: DetailBlankSt | null; order: OrderSt }) => {
    if (!blank) return null
    return (
      <Stack>
        <Label label="Заготовка" />
        <DetailBlank blank={blank} order={order} />
      </Stack>
    )
  },
)

const DetailAttachments = observer(({ detail }: { detail: DetailSt }) => {
  if (detail.attachments.files.length === 0) return null
  return (
    <Stack>
      <Label label="Файлы" />
      {detail.attachments.files.map(file => (
        <AttachmentComponent
          key={file.key}
          attachment={file}
          editable={false}
        />
      ))}
    </Stack>
  )
})

const Dates = observer(({ order }: { order: OrderSt }) => {
  if (!order.resp) return null
  const startedAt = order.resp.started_at
    ? fmtDate(new Date(order.resp.started_at))
    : null
  const finishedAt = order.resp.finished_at
    ? fmtDate(new Date(order.resp.finished_at), true)
    : null

  const expr = [
    { t: 'Старт', v: startedAt },
    { t: 'Завершен', v: finishedAt },
  ]
  return (
    <Row gap={1}>
      {expr.map(each => {
        if (!each.v) return null
        return (
          <>
            <Label xs label={each.t} />
            <Label xs>{each.v}</Label>
          </>
        )
      })}
    </Row>
  )
})

const TechPassportButton = ({ order }: OrderStProp) => {
  if (
    ![OrderStatus.Preparation, OrderStatus.Production].includes(order.status)
  ) {
    return null
  }
  return (
    <Button
      onClick={() => window.print()}
      color="primary"
      variant="outlined"
      sx={{ width: 'fit-content' }}
    >
      Тех. паспорт
    </Button>
  )
}

const PrintingPageVerion = (props: DetailStProp & OrderStProp) => (
  <>
    <TechPassportTable {...props} />
    <ProductionRoute {...props} />
  </>
)

const DeleteOrderButton = observer(({ order }: OrderStProp) => {
  const navigate = useNavigate()
  const msg = `Удалить заказ?\nEсли заказ находится в состоянии "Производство" - значит материал уже был списан. 
												В этом случае необходимо вручную скорректировать остатки через поставку.`
  return (
    <DeleteResourceButton
      onClick={e => {
        e.stopPropagation()
        if (window.confirm(msg)) {
          api.delete(order!.id).then(() => {
            navigate(routeMap.pdo.index)
          })
        }
      }}
    />
  )
})

const QuantityInput = observer(
  ({ recBatchSize, order }: OrderStProp & { recBatchSize?: number }) => {
    const isProduction = order.status === OrderStatus.Production
    const isCollected = order.status === OrderStatus.Collected

    const mode = isProduction
      ? {
          label: 'Выпуск',
          initialQty: order.outputQty,
          save: (qty: number) => order.setOutputQty(qty),
          notification: 'Выпуск установлен',
        }
      : {
          label: 'Кол-во',
          initialQty: order.qty,
          save: (qty: number) => order.setQty(qty),
          notification: 'Кол-во установлено',
        }

    const [qty, setQty] = useState<number | undefined>(mode.initialQty)

    const isUnchanged = qty === mode.initialQty

    const handleSave = async () => {
      if (qty == null) return
      await api.set_qty(order, qty)
      mode.save(qty)
      notifier.ok(mode.notification)
    }

    useEffect(() => {
      setQty(mode.initialQty)
    }, [mode.initialQty])

    if (isCollected) {
      return (
        <Row gap={1}>
          <Label label="Кол-во" />
          <P>{order.outputQty ?? order.qty}</P>
        </Row>
      )
    }

    return (
      <Stack>
        {recBatchSize && (
          <P level="body-xs" color="primary">
            Реком. размер партии — {recBatchSize}
          </P>
        )}

        {isProduction && (
          <P level="body-xs" color="neutral">
            Заказано — {order.qty}
          </P>
        )}

        <Row alignItems="end">
          <NumberInput
            label={mode.label}
            size="sm"
            sx={{ maxWidth: 80 }}
            value={qty}
            variant="outlined"
            onChange={setQty}
          />
          <SaveIconButton
            size="sm"
            variant="soft"
            disabled={qty == null || isUnchanged}
            onClick={handleSave}
          />
        </Row>
      </Stack>
    )
  },
)

const ActionButton = observer(({ order }: OrderStProp) => {
  switch (order.status as OrderStatus) {
    case OrderStatus.Waiting:
      return (
        <Button
          size="sm"
          color="success"
          onClick={() => api.startPreparation(order)}
          disabled={api.loader.loading}
        >
          В подготовку
        </Button>
      )
    case OrderStatus.Preparation:
      return (
        <Button
          size="sm"
          color="primary"
          onClick={() => api.startProduction(order)}
          disabled={api.loader.loading || !order.qty}
        >
          В производство
        </Button>
      )
    case OrderStatus.Production:
      return (
        <Button
          onClick={() => api.finish(order)}
          disabled={api.loader.loading}
          size="sm"
          color="primary"
        >
          В архив
        </Button>
      )
    case OrderStatus.Collected:
      return (
        <Button
          onClick={() => api.returnToProduction(order)}
          disabled={api.loader.loading}
          size="sm"
          color="danger"
          variant="outlined"
        >
          Вернуть в производство
        </Button>
      )
    default:
      return null
  }
})

const DuplicationCheckModal = observer(({ order }: { order: OrderSt }) => {
  const navigate = useNavigate()
  if (!order.orderAlreadyInProductionModal) return null
  const detail = app_cache.details.get(
    order.orderAlreadyInProductionModal.detailId,
  )
  if (!detail) return null
  const modalState = order.orderAlreadyInProductionModal
  return (
    <InModal
      size="lg"
      open={Boolean(order.orderAlreadyInProductionModal)}
      setOpen={() => order.setOrderAlreadyInProductionModal(null)}
      onClose={() => order.setOrderAlreadyInProductionModal(null)}
    >
      <P>
        Заказ на производство{' '}
        <b>
          {detail.name} - {modalState.qty} шт
        </b>{' '}
        уже в производстве под номером <b>{modalState.manufacturingId}</b>
      </P>
      <Row mt={3}>
        <Button
          size="sm"
          variant="soft"
          onClick={async () => {
            navigate(
              openPage(routeMap.pdo.order.edit, modalState.manufacturingId),
            )
            order.setOrderAlreadyInProductionModal(null)
            await api.delete(order.id)
          }}
        >
          Открыть существующий и удалить текущий
        </Button>
        <Button
          size="sm"
          variant="soft"
          onClick={async () => {
            order.setOrderAlreadyInProductionModal(null)
            await api.startProduction(order, true)
          }}
          disabled={api.loader.loading}
        >
          Запустить новый
        </Button>
      </Row>
    </InModal>
  )
})

const OrderPrioritySelect = observer(({ order }: { order: OrderSt }) => (
  <EnumSelect
    labels={UiOrderPriority}
    label="Приоритет"
    enum={OrderPriority}
    onChange={v => order.set_priority(v)}
    value={order.priority}
  />
))
