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
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
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
        <P>{order.detail_name}</P>
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
