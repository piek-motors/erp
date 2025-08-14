import { Box, Card, Divider } from '@mui/joy'
import { DetailName } from 'domains/metalflow/detail/name'
import { MaterialName } from 'domains/metalflow/shared'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import {
  Button,
  DeleteResourceButton,
  ErrorHint,
  Inp,
  Label,
  Loading,
  observer,
  P,
  routeMap,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
import { EnManufacturingOrderStatus, uiManufacturingOrderStatus } from 'models'
import { MaterialCost } from '../detail/warehouse/cost.store'
import { api } from './api'

export const ManufacturingUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      api.load(Number(id))
    }
  }, [id])

  if (!api.s.order) {
    return <div>Заказ не найден</div>
  }

  const deletionAllowed = [
    EnManufacturingOrderStatus.Waiting,
    EnManufacturingOrderStatus.MaterialPreparation
  ]

  const isDeletionAllowed = deletionAllowed.includes(api.s.order.status)

  if (api.status.loading) {
    return <Loading />
  }
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={`Производственный заказ #${api.s.order.id}`} />
      <Stack>
        <Label label="Деталь" />
        <DetailName
          withGroupLink
          withLink
          withParamsButton
          detail={{
            id: api.s.order.detail_id,
            name: api.s.order.detail_name,
            group_id: api.s.order.group_id || null
          }}
        />
      </Stack>

      <Stack>
        <Label label="Необходимые материалы" />
        {api.s.detail.autoWriteoff.materialsCost.length > 0 ? (
          <Stack gap={0.5}>
            {api.s.detail.autoWriteoff.materialsCost.map((cost, index) => (
              <DetailMaterialInfo key={index} cost={cost} />
            ))}
          </Stack>
        ) : (
          <P color="danger">Материалы детали не указаны</P>
        )}
      </Stack>

      <Stack>
        <Label label="Статус" />
        <P>{uiManufacturingOrderStatus(api.s.order.status)}</P>
      </Stack>

      <Stack>
        <Label label="Дата создания" />
        <P>{formatDateWithTime(api.s.order.started_at)}</P>
      </Stack>

      {api.s.order.finished_at && (
        <Stack>
          <Label label="Дата окончания" />
          <P>{formatDateWithTime(api.s.order.finished_at)}</P>
        </Stack>
      )}

      <QuantityInput />
      <Divider />
      <Stack gap={1} mt={1}>
        {api.status.loading && <Loading />}
        <ErrorHint e={api.status.error} />
        <Box>
          <ActionButton status={api.s.order.status} />
        </Box>
      </Stack>

      {isDeletionAllowed && (
        <Box>
          <DeleteResourceButton
            onClick={e => {
              e.stopPropagation()
              if (window.confirm(`Удалить производственный заказ?`)) {
                api.delete().then(() => {
                  navigate(routeMap.metalflow.manufacturing_orders)
                })
              }
            }}
          />
        </Box>
      )}
    </Stack>
  )
})

const QuantityInput = observer(() => {
  if (!api.s.order) return null
  if (api.s.order.status === EnManufacturingOrderStatus.MaterialPreparation) {
    return (
      <Inp
        label="Кол-во"
        sx={{ maxWidth: 70 }}
        value={api.s.qty}
        onChange={v => {
          api.s.setQty(v)
        }}
      />
    )
  }
  if (api.s.order.status === EnManufacturingOrderStatus.Production) {
    return (
      <Stack>
        <Label label="Кол-во" />
        <P>{api.s.order.qty}</P>
      </Stack>
    )
  }
  return null
})

const ActionButton = observer(
  (props: { status: EnManufacturingOrderStatus }) => {
    switch (props.status) {
      case EnManufacturingOrderStatus.Waiting:
        return (
          <Button
            onClick={() => api.startMaterialPreparationPhase()}
            disabled={api.status.loading}
          >
            Начать подготовку материалов
          </Button>
        )
      case EnManufacturingOrderStatus.MaterialPreparation:
        return (
          <Button
            color="success"
            onClick={() => api.startProductionPhase()}
            disabled={api.status.loading || !api.s.qty}
          >
            Начать производство
          </Button>
        )
      case EnManufacturingOrderStatus.Production:
        return (
          <Button onClick={() => api.finish()} disabled={api.status.loading}>
            Завершить заказ
          </Button>
        )
      default:
        return null
    }
  }
)

const DetailMaterialInfo = observer((props: { cost: MaterialCost }) => {
  const { cost } = props
  const totalConsumedAmount = (parseInt(api.s.qty) * (+cost.length || 0)) / 1000
  const remainingAmount = (cost.material?.stock || 0) - totalConsumedAmount
  return (
    <Stack py={0.5}>
      <Card variant="outlined" size="sm">
        <Row gap={1}>
          <MaterialName
            materialId={cost.materialId}
            materialLabel={cost.material?.label || ''}
            withLink
          />
          <P level="body-sm" color="primary">
            Расход {cost?.length || 'не указано'} мм
          </P>
        </Row>
        <P level="body-sm" color="neutral">
          Текущий остаток: {cost.material?.stock?.toFixed(1)} м
        </P>
        {api.s.qty && (
          <>
            <P level="body-sm" color="primary">
              Потребное количество: {totalConsumedAmount.toFixed(3)} м
            </P>
            <P
              color={
                remainingAmount > 0
                  ? 'success'
                  : remainingAmount < 0
                  ? 'danger'
                  : 'primary'
              }
              level="body-sm"
            >
              Остаток после запуска {remainingAmount.toFixed(1)} м
            </P>
          </>
        )}
      </Card>
    </Stack>
  )
})
