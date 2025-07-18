import { Box, Card, Divider } from '@mui/joy'
import {
  EnManufacturingOrderStatus,
  uiManufacturingOrderStatus
} from 'domain-model'
import {
  Button,
  DeleteResourceButton,
  ErrorHint,
  Inp,
  Label,
  LoadingHint,
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
import { DetailName } from 'metalflow/details/name'
import { MaterialName } from 'metalflow/shared'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { DetailMaterialOutput, store } from './order.store'

export const ManufacturingUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      store.load(Number(id))
    }
  }, [id])

  if (!store.order) {
    return <div>Заказ не найден</div>
  }

  const deletionAllowed = [
    EnManufacturingOrderStatus.Waiting,
    EnManufacturingOrderStatus.MaterialPreparation
  ]
  const isDeletionAllowed = deletionAllowed.includes(store.order.status)

  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle
        title={`Производственный заказ #${store.order.id}`}
        hideIcon
      />
      <Stack>
        <Label label="Деталь" />
        <DetailName
          showLinkButton
          showParamsButton
          detail={{
            id: store.order.detail_id,
            name: store.order.detail_name,
            group_id: store.order.group_id || null
          }}
        />
      </Stack>

      <Stack>
        <Label label="Необходимые материалы" />
        {store.detailMaterials.length > 0 ? (
          <Stack gap={0.5}>
            {store.detailMaterials.map((material, index) => (
              <DetailMaterialInfo key={index} material={material} />
            ))}
          </Stack>
        ) : (
          <P color="danger">Материалы детали не указаны</P>
        )}
      </Stack>

      <Stack>
        <Label label="Статус" />
        <P>{uiManufacturingOrderStatus(store.order.status)}</P>
      </Stack>

      <Stack>
        <Label label="Дата создания" />
        <P>{formatDateWithTime(store.order.started_at)}</P>
      </Stack>

      {store.order.finished_at && (
        <Stack>
          <Label label="Дата окончания" />
          <P>{formatDateWithTime(store.order.finished_at)}</P>
        </Stack>
      )}

      <QuantityInput />
      <Divider />
      <Stack gap={1} mt={1}>
        <LoadingHint show={store.async.loading} />
        <ErrorHint e={store.async.error} />
        <Box>
          <ActionButton status={store.order.status} />
        </Box>
      </Stack>

      {isDeletionAllowed && (
        <Box>
          <DeleteResourceButton
            onClick={e => {
              e.stopPropagation()
              if (window.confirm(`Удалить производственный заказ?`)) {
                store.delete().then(() => {
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
  if (!store.order) return null
  if (store.order.status === EnManufacturingOrderStatus.MaterialPreparation) {
    return (
      <Inp
        label="Кол-во"
        sx={{ maxWidth: 70 }}
        value={store.qty}
        onChange={v => {
          store.setQty(v)
        }}
      />
    )
  }
  if (store.order.status === EnManufacturingOrderStatus.Production) {
    return (
      <Stack>
        <Label label="Кол-во" />
        <P>{store.order.qty}</P>
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
            onClick={() => store.startMaterialPreparationPhase()}
            disabled={store.async.loading}
          >
            Начать подготовку материалов
          </Button>
        )
      case EnManufacturingOrderStatus.MaterialPreparation:
        return (
          <Button
            color="success"
            onClick={() => store.startProductionPhase()}
            disabled={store.async.loading || !store.qty}
          >
            Начать производство
          </Button>
        )
      case EnManufacturingOrderStatus.Production:
        return (
          <Button onClick={() => store.finish()} disabled={store.async.loading}>
            Завершить заказ
          </Button>
        )
      default:
        return null
    }
  }
)

const DetailMaterialInfo = observer(
  (props: { material: DetailMaterialOutput }) => {
    const { material } = props
    const totalConsumedAmount =
      (parseInt(store.qty) * (material.data?.length || 0)) / 1000

    const remainingAmount = (material.stock || 0) - totalConsumedAmount

    return (
      <Stack py={0.5}>
        <Card variant="outlined" size="sm">
          <Row gap={1}>
            <MaterialName
              materialId={material.id || 0}
              materialLabel={material.label || ''}
              showLinkButton
            />
            <P level="body-sm" color="primary">
              Расход {material.data?.length || 'не указано'} мм
            </P>
          </Row>
          <P level="body-sm" color="neutral">
            Текущий остаток: {material.stock?.toFixed(1)} м
          </P>
          {store.qty && (
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
  }
)
