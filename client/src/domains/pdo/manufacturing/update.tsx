import { Box, Card, Divider } from '@mui/joy'
import { PrintOnly, WebOnly } from 'components/utilities/conditional-display'
import { DetailName } from 'domains/pdo/detail/name'
import { ComplexTitle, MaterialName, MetalPageTitle } from 'domains/pdo/shared'
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
  SaveIconButton,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { formatDate, roundAndTrim } from 'lib/utils/formatting'
import { EnManufacturingOrderStatus, uiManufacturingOrderStatus } from 'models'
import { TechParamsDisplay } from '../detail/components'
import { MaterialCost } from '../detail/warehouse/cost.store'
import { api } from './api'
import { ManufacturingOrderState } from './order.state'
import { DetailTechPassportTable } from './tech_passport/passport_table'
import { ProductionRoute } from './tech_passport/production_route_table'
import { DetailDescription } from './tech_passport/shared'

const deletionAllowed = [
  EnManufacturingOrderStatus.Waiting,
  EnManufacturingOrderStatus.MaterialPreparation,
  EnManufacturingOrderStatus.Production
]

export const ManufacturingUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id) {
      api.load(Number(id))
    }
  }, [id])

  if (api.status.loading) {
    return <Loading />
  }
  if (!api.s.order) {
    return <div>Заказ не найден</div>
  }
  const isDeletionAllowed = deletionAllowed.includes(api.s.order.status)
  return (
    <Stack py={2} gap={1}>
      <WebOnly>
        <Stack gap={1}>
          <MetalPageTitle
            t={
              <ComplexTitle
                subtitle="Заказ"
                title={
                  <DetailName
                    withLink
                    withParamsButton
                    detail={{
                      id: api.s.order.detail_id,
                      name: api.s.order.detail_name,
                      group_id: api.s.order.group_id || null
                    }}
                  />
                }
                index={api.s.order.id}
              />
            }
          />
          <TechPassportButton />
          <Row gap={1} alignItems={'start'}>
            <Stack>
              <QuantityInput />
              <Row gap={1}>
                <Label label="Статус" />
                <P>{uiManufacturingOrderStatus(api.s.order.status)}</P>
              </Row>

              <Row>
                <Label label="Создан" />
                <P>{formatDate(new Date(api.s.order.created_at))}</P>
              </Row>

              {api.s.order.finished_at && (
                <Row>
                  <Label label="Завершен" />
                  <P>{formatDate(new Date(api.s.order.finished_at))}</P>
                </Row>
              )}
            </Stack>
            <Cost />
          </Row>
          <Row gap={2}>
            <Stack display={'flex'} alignSelf={'start'}>
              <Label label="Заготовка" />
              <TechParamsDisplay
                params={api.s.detail.blankSpec}
                level="body-xs"
              />
            </Stack>
            <Divider orientation="vertical" />
            <DetailDescription htmlContent={api.s.detail.description} />
          </Row>

          <Row mt={1}>
            {api.status.loading && <Loading />}
            <ErrorHint e={api.status.error} />
            <ActionButton status={api.s.order.status} />
            {isDeletionAllowed && <DeleteOrderButton />}
          </Row>
        </Stack>
      </WebOnly>

      <PrintOnly display="block">
        <PrintingPageVerion order={api.s} />
      </PrintOnly>
    </Stack>
  )
})

const TechPassportButton = () => {
  if (api.s.order?.status !== EnManufacturingOrderStatus.Production) {
    return null
  }
  return (
    <Box>
      <Button onClick={() => window.print()} color="neutral" variant="soft">
        Тех. паспорт
      </Button>
    </Box>
  )
}

const PrintingPageVerion = (props: { order: ManufacturingOrderState }) => (
  <>
    <DetailTechPassportTable order={props.order} />
    <ProductionRoute />
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
          api.delete().then(() => {
            navigate(routeMap.pdo.manufacturing_orders)
          })
        }
      }}
    />
  )
})

export const Cost = observer(() => {
  const materialCost = api.s.detail.autoWriteoff.materialCost
  const details = api.s.detail.autoWriteoff.detailsCost
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
      ) : null}
    </Row>
  )
})

const QuantityInput = observer(() => {
  if (!api.s.order) return null
  if (api.s.order.status === EnManufacturingOrderStatus.MaterialPreparation) {
    const recBatchSize = api.s.detail.recommendedBatchSize
    return (
      <Card size="sm" variant="outlined">
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
  if (api.s.order.status === EnManufacturingOrderStatus.Production) {
    return (
      <Row gap={1}>
        <Label label="Кол-во" />
        <P>{api.s.order.qty}</P>
      </Row>
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
            size="sm"
            variant="soft"
            color="success"
            onClick={() => api.startMaterialPreparationPhase()}
            disabled={api.status.loading}
          >
            Начать подготовку материалов
          </Button>
        )
      case EnManufacturingOrderStatus.MaterialPreparation:
        return (
          <Button
            size="sm"
            variant="soft"
            color="success"
            onClick={() => api.startProductionPhase()}
            disabled={api.status.loading || !api.s.qty}
          >
            Начать производство
          </Button>
        )
      case EnManufacturingOrderStatus.Production:
        return (
          <Button
            onClick={() => api.finish()}
            disabled={api.status.loading}
            size="sm"
            variant="soft"
            color="danger"
          >
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
    <Box>
      <Row>
        <MaterialName
          materialId={cost.materialId}
          materialLabel={cost.material?.label || ''}
          withLink
        />
        <Label level="body-sm" color="primary">
          Расход {cost?.length || 'не указано'} мм
        </Label>
      </Row>
      {api.s.qty && (
        <>
          <P level="body-sm" color="primary">
            Потребное кол-во: {roundAndTrim(totalConsumedAmount) || 0} м
          </P>

          <P level="body-sm" color="neutral">
            Остаток: {roundAndTrim(cost.material?.stock) || 0} м
          </P>

          {api.s.order?.status ===
            EnManufacturingOrderStatus.MaterialPreparation && (
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
              Остаток после запуска {remainingAmount.toFixed(1)} м
            </P>
          )}
        </>
      )}
    </Box>
  )
})
