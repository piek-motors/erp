import { Box, Card, Chip, ChipProps, Divider } from '@mui/joy'
import { AttachmentComponent } from 'components/attachments/attachment'
import { InModal } from 'components/modal'
import { PrintOnly, WebOnly } from 'components/utilities/conditional-display'
import { DetailName } from 'domains/pdo/detail/name'
import { MaterialName, MetalPageTitle } from 'domains/pdo/shared'
import {
  Button,
  DeleteResourceButton,
  Inp,
  Label,
  Loading,
  observer,
  openPage,
  P,
  routeMap,
  Row,
  SaveIconButton,
  Stack,
  useEffect,
  useNavigate,
  useParams,
  useState
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { fmtDate, timeDeltaDays } from 'lib/utils/date_fmt'
import { roundAndTrim } from 'lib/utils/fmt'
import {
  ManufacturingOrderStatus,
  uiManufacturingOrderStatus,
  uiUnit
} from 'models'
import { cache } from '../cache/root'
import { TechParamsDisplay } from '../detail/components'
import { BlankSpec, DetailState } from '../detail/detail.state'
import { MaterialCost } from '../detail/warehouse/cost.store'
import { api } from './api'
import {
  ManufacturingOrderOutput,
  ManufacturingOrderState
} from './order.state'
import { DetailTechPassportTable } from './tech_passport/passport_table'
import { ProductionRoute } from './tech_passport/production_route_table'
import { DetailDescription } from './tech_passport/shared'

const deletionAllowed = [
  ManufacturingOrderStatus.Waiting,
  ManufacturingOrderStatus.Preparation,
  ManufacturingOrderStatus.Production
]

export const ManufacturingUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const [detail, setDetail] = useState<DetailState | null>(null)
  const [order, setOrder] = useState<ManufacturingOrderOutput | null>(null)
  useEffect(() => {
    if (id) {
      api.load(Number(id)).then(({ detail, order }) => {
        setDetail(detail)
        setOrder(order)
      })
    }
  }, [id])

  if (api.status.loading) {
    return <Loading />
  }
  if (!api.s.order) {
    return <div>Заказ не найден</div>
  }
  const isDeletionAllowed = deletionAllowed.includes(api.s.order.status)
  if (!detail || !order) return <Loading />
  return (
    <Stack p={1} gap={1}>
      <WebOnly>
        <Card size="sm">
          <Stack gap={1}>
            <MetalPageTitle
              t={
                <Box width={'max-content'}>
                  <Row>
                    <P level="body-sm" whiteSpace={'nowrap'}>
                      Заказ №{api.s.order.id}
                    </P>
                    <OrderStatus status={api.s.order.status} />
                  </Row>
                  <DetailName
                    detail={{
                      id: detail.id,
                      name: detail.name,
                      group_id: detail.groupId || null
                    }}
                    withGroupName
                  />
                </Box>
              }
            />
            <Divider />
            <Row gap={1} alignItems={'start'}>
              <Stack>
                <QuantityInput detail={detail} />
                <TechPassportButton />
              </Stack>
              <ProductionSteps detail={detail} />
              <Cost detail={detail} />
            </Row>
            <Row gap={2} alignItems={'start'} flexWrap={'wrap'}>
              <BlankSpecDisplay blankSpec={detail?.blankSpec} />
              <DetailAttachments detail={detail} />
              <DetailDescription htmlContent={detail.description} />
            </Row>

            <Dates />
            <Row>
              {api.status.loading && <Loading />}
              <ActionButton status={api.s.order.status} />
              {isDeletionAllowed && <DeleteOrderButton />}
            </Row>
          </Stack>
        </Card>
        <DuplicationCheckModal />
      </WebOnly>

      <PrintOnly display="block">
        <PrintingPageVerion order={api.s} detail={detail} />
      </PrintOnly>
    </Stack>
  )
})

const OrderStatus = observer(
  ({ status }: { status: ManufacturingOrderStatus }) => {
    let color: ChipProps['color'] = 'neutral'
    switch (status) {
      case ManufacturingOrderStatus.Production:
        color = 'primary'
        break
      case ManufacturingOrderStatus.Collected:
        color = 'success'
        break
    }
    return (
      <Chip color={color} variant="solid" size="sm">
        {uiManufacturingOrderStatus(status)}
      </Chip>
    )
  }
)

const ProductionSteps = observer((props: { detail: DetailState }) => {
  if (props.detail.processingRoute.steps.length === 0) return null
  return (
    <Card size="sm" variant="outlined">
      <Label label="Этапы обработки" />
      <Stack>
        {props.detail.processingRoute.steps.map((step, index) => {
          const current = api.s.currentOperation === index
          const timedelta =
            current &&
            api.s.order?.current_operation_start_at &&
            timeDeltaDays(api.s.order.current_operation_start_at)
          return (
            <Row>
              <Button
                size="sm"
                key={step.name}
                variant={current ? 'solid' : 'plain'}
                sx={{ width: 'fit-content' }}
                color={current ? 'primary' : 'neutral'}
                onClick={() => api.setCurrentOperation(index)}
              >
                {step.name}
              </Button>
              <Label>{timedelta}</Label>
            </Row>
          )
        })}
      </Stack>
    </Card>
  )
})

const BlankSpecDisplay = observer(
  ({ blankSpec }: { blankSpec?: BlankSpec | null }) => {
    if (blankSpec == null || blankSpec.arr.length === 0) return null
    return (
      <Stack display={'flex'} alignSelf={'start'}>
        <Label label="Заготовка" />
        <TechParamsDisplay params={blankSpec} level="body-xs" />
      </Stack>
    )
  }
)

const DetailAttachments = observer(({ detail }: { detail: DetailState }) => {
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

const Dates = observer(() => {
  if (!api.s.order) return null
  const createdAt = fmtDate(new Date(api.s.order.created_at))
  const startedAt = api.s.order.started_at
    ? fmtDate(new Date(api.s.order.started_at), true)
    : null
  const finishedAt = api.s.order.finished_at
    ? fmtDate(new Date(api.s.order.finished_at), true)
    : null
  return (
    <Row gap={1}>
      <>
        <Label xs label="Создан" />
        <P level="body-xs">{createdAt}</P>
      </>

      {startedAt && (
        <>
          <Label xs label="Старт" />
          <P level="body-xs">{startedAt}</P>
        </>
      )}

      {finishedAt && (
        <>
          <Label xs label="Завершен" />
          <P level="body-xs">{finishedAt}</P>
        </>
      )}
    </Row>
  )
})

const TechPassportButton = () => {
  if (api.s.order?.status !== ManufacturingOrderStatus.Production) {
    return null
  }
  return (
    <Button
      onClick={() => window.print()}
      color="neutral"
      variant="outlined"
      sx={{ width: 'fit-content' }}
    >
      Тех. паспорт
    </Button>
  )
}

const PrintingPageVerion = (props: {
  order: ManufacturingOrderState
  detail: DetailState
}) => (
  <>
    <DetailTechPassportTable order={props.order} detail={props.detail} />
    <ProductionRoute detail={props.detail} />
  </>
)

const DeleteOrderButton = observer(() => {
  const navigate = useNavigate()
  return (
    <DeleteResourceButton
      onClick={e => {
        e.stopPropagation()
        if (
          window.confirm(
            `Удалить заказ?\nEсли заказ находится в состоянии "Производство" - значит материал уже был списан. В этом случае необходимо вручную скорректировать остатки через поставку.`
          )
        ) {
          api.delete(api.s.order!.id).then(() => {
            navigate(routeMap.pdo.manufacturing_orders)
          })
        }
      }}
    />
  )
})

const Cost = observer(({ detail }: { detail: DetailState }) => {
  if (api.s.order?.status === ManufacturingOrderStatus.Collected) {
    return null
  }

  const materialCost = detail.autoWriteoff.materialCost
  const details = detail.autoWriteoff.detailsCost
  return (
    <Row alignItems={'start'}>
      {!!materialCost ? (
        <Card size="sm">
          <Label label="Материал к потреблению" />
          <Stack gap={0.5}>
            <DetailMaterialInfo cost={materialCost} />
          </Stack>
        </Card>
      ) : null}
      {/* 
      {!!details.length ? (
        <Card size="sm">
          <Label label="Детали к потреблению" />
          <Stack gap={0.5}>
            {details.map((cost, index) => (
              <Row>
                <DetailName
                  detail={{
                    id: cost.detailId,
                    name: cost.detail?.name || '',
                    group_id: cost.detail?.groupId || null
                  }}
                />
                <P>{cost.qty} шт</P>
              </Row>
            ))}
          </Stack>
        </Card>
      ) : null} */}
    </Row>
  )
})

const QuantityInput = observer(({ detail }: { detail: DetailState }) => {
  if (!api.s.order) return null
  if (api.s.order.status === ManufacturingOrderStatus.Preparation) {
    const recBatchSize = detail.recommendedBatchSize
    return (
      <Card size="sm" variant="plain">
        <Label>Кол-во</Label>
        <Stack>
          {recBatchSize && (
            <P level="body-sm" color="primary">
              Рекомендуемый размер партии - {recBatchSize} шт
            </P>
          )}
          <Row alignItems={'end'}>
            <Inp
              sx={{ maxWidth: 70 }}
              value={api.s.qty || ''}
              variant="solid"
              color="neutral"
              onChange={v => {
                api.s.setQty(v)
              }}
            />
            <SaveIconButton
              variant="solid"
              color="neutral"
              onClick={() =>
                api.save().then(() => {
                  notifier.notify('info', 'Кол-во установлено')
                })
              }
            />
          </Row>
        </Stack>
      </Card>
    )
  }

  if (
    [
      ManufacturingOrderStatus.Production,
      ManufacturingOrderStatus.Collected
    ].includes(api.s.order.status)
  ) {
    return (
      <Row gap={1}>
        <Label label="Кол-во" />
        <P>{api.s.order.qty}</P>
      </Row>
    )
  }
})

const ActionButton = observer((props: { status: ManufacturingOrderStatus }) => {
  switch (props.status) {
    case ManufacturingOrderStatus.Waiting:
      return (
        <Button
          size="sm"
          color="success"
          onClick={() => api.startMaterialPreparationPhase()}
          disabled={api.status.loading}
        >
          Начать подготовку материалов
        </Button>
      )
    case ManufacturingOrderStatus.Preparation:
      return (
        <Button
          size="sm"
          color="primary"
          onClick={() => api.startProductionPhase()}
          disabled={api.status.loading || !api.s.qty}
        >
          Начать производство
        </Button>
      )
    case ManufacturingOrderStatus.Production:
      return (
        <Button
          onClick={() => api.finish()}
          disabled={api.status.loading}
          size="sm"
          color="success"
        >
          Завершить заказ
        </Button>
      )
    default:
      return null
  }
})

const DuplicationCheckModal = observer(() => {
  const navigate = useNavigate()
  if (!api.s.orderAlreadyInProductionModal) return null
  const detail = cache.details.get(api.s.orderAlreadyInProductionModal.detailId)
  if (!detail) return null
  const order = api.s.orderAlreadyInProductionModal
  return (
    <InModal
      size="lg"
      open={Boolean(api.s.orderAlreadyInProductionModal)}
      setOpen={() => api.s.setOrderAlreadyInProductionModal(null)}
      onClose={() => api.s.setOrderAlreadyInProductionModal(null)}
    >
      <P>
        Заказ на производство{' '}
        <b>
          {detail.name} - {order.qty} шт
        </b>{' '}
        уже в производстве под номером <b>{order.manufacturingId}</b>
      </P>
      <Stack gap={1} mt={3}>
        <Button
          size="sm"
          onClick={async () => {
            navigate(
              openPage(
                routeMap.pdo.manufacturing_order.edit,
                order.manufacturingId
              )
            )
            api.s.setOrderAlreadyInProductionModal(null)
            await api.delete(api.s.order!.id)
          }}
        >
          Открыть существующий заказ и удалить текущий
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="soft"
          onClick={async () => {
            api.s.setOrderAlreadyInProductionModal(null)
            await api.startProductionPhase(true)
          }}
          disabled={api.status.loading}
        >
          Запустить новый заказ
        </Button>
      </Stack>
    </InModal>
  )
})

const DetailMaterialInfo = observer((props: { cost: MaterialCost }) => {
  const { cost } = props
  const totalConsumedAmount = parseInt(api.s.qty) * (cost.length || 0)
  const remainingAmount = (cost.material?.stock || 0) - totalConsumedAmount
  const unit = uiUnit(cost?.material?.unit)
  return (
    <Box>
      <Row>
        <MaterialName
          materialId={cost.materialId}
          materialLabel={cost.material?.label || ''}
        />
        <Label level="body-sm" color="primary">
          Расход {cost?.length || 'не указано'}{' '}
          {uiUnit(cost.material?.unit) || ''}
        </Label>
      </Row>
      <Divider sx={{ my: 0.5 }} />
      {api.s.qty && (
        <>
          <P level="body-sm" color="neutral">
            Потребное кол-во: {roundAndTrim(totalConsumedAmount, 3) || 0} {unit}
          </P>

          <P level="body-sm" color="neutral">
            Остаток: {roundAndTrim(cost.material?.stock, 3) || 0} {unit}
          </P>

          {api.s.order?.status === ManufacturingOrderStatus.Preparation && (
            <P
              color={
                remainingAmount >= 0
                  ? 'success'
                  : remainingAmount < 0
                  ? 'danger'
                  : 'primary'
              }
              level="body-sm"
            >
              Остаток после запуска {remainingAmount.toFixed(1)} {unit}
            </P>
          )}
        </>
      )}
    </Box>
  )
})
