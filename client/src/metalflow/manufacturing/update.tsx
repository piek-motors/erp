import { Box } from '@mui/joy'
import { PageTitle } from 'components/page-title'
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
import { store } from './order.store'

export const ManufacturingUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      store.load(Number(id))
    }
  }, [id])

  if (store.async.loading) {
    return <div>Загрузка...</div>
  }

  if (!store.order) {
    return <div>Заказ не найден</div>
  }

  const order = store.order

  const deletionAllowed = [
    EnManufacturingOrderStatus.Waiting,
    EnManufacturingOrderStatus.MaterialPreparation
  ]
  const isDeletionAllowed = deletionAllowed.includes(order.status)

  return (
    <Stack gap={1} p={1}>
      <PageTitle title={`Производственный заказ #${order.id}`} />

      <Stack>
        <Label label="Деталь" />
        <DetailName
          showLinkButton
          showParamsButton
          detail={{
            id: order.detail_id,
            name: order.detail_name,
            group_id: order.group_id || null
          }}
        />
      </Stack>

      <Stack>
        <Label label="Необходимые материалы" />
        {store.detailMaterials.length > 0 ? (
          <Stack gap={0.5}>
            {store.detailMaterials.map((material, index) => (
              <Row gap={1}>
                <MaterialName
                  materialId={material.id || 0}
                  materialLabel={material.label || ''}
                  showLinkButton
                />
                -
                <P level="body-sm" color="primary">
                  расход {material.data?.length || 'не указано'} мм
                </P>
              </Row>
            ))}
          </Stack>
        ) : (
          <P sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            Материалы не указаны
          </P>
        )}
      </Stack>

      <Stack>
        <Label label="Статус" />
        <P>{uiManufacturingOrderStatus(order.status)}</P>
      </Stack>

      <Stack>
        <Label label="Дата создания" />
        <P>{formatDateWithTime(order.started_at)}</P>
      </Stack>

      {order.finished_at && (
        <Stack>
          <Label label="Дата окончания" />
          <P>{formatDateWithTime(order.finished_at)}</P>
        </Stack>
      )}

      <Stack>
        <Inp
          label="Кол-во"
          sx={{ maxWidth: 100 }}
          type="number"
          value={store.qty}
          onChange={v => {
            const qty = Number(v)
            if (qty > 0) {
              store.setQty(qty)
            }
          }}
        />
      </Stack>

      <Stack gap={1} mt={2}>
        <P fontWeight={'bold'}>Действия</P>
        <LoadingHint show={store.async.loading} />
        <ErrorHint e={store.async.error} />

        {order.status === EnManufacturingOrderStatus.Waiting && (
          <Button
            onClick={() => store.startMaterialPreparation()}
            disabled={store.async.loading}
          >
            Начать подготовку материалов
          </Button>
        )}

        {order.status === EnManufacturingOrderStatus.MaterialPreparation && (
          <Button
            onClick={() => store.startProduction()}
            disabled={store.async.loading || store.qty === 0}
          >
            Начать производство
          </Button>
        )}

        {order.status === EnManufacturingOrderStatus.Production && (
          <Button onClick={() => store.finish()} disabled={store.async.loading}>
            Завершить заказ
          </Button>
        )}
      </Stack>

      {isDeletionAllowed && (
        <Box>
          <DeleteResourceButton
            onClick={e => {
              e.stopPropagation()
              if (
                window.confirm(`Удалить производственный заказ ${order.id}?`)
              ) {
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
