import { Stack } from '@mui/joy'
import { fmt } from 'shared'
import {
  Indicator,
  MetalPageTitle,
  SaveAndDelete,
} from '@/domains/pdo/shared/basic'
import {
  ActionButton,
  Link,
  Loading,
  observer,
  openPage,
  P,
  Row,
  routeMap,
  useEffect,
  useNavigate,
  useParams,
  useState,
} from '@/lib/index'
import { fmtDate, fmtTimestamp } from '@/lib/utils/date_fmt'
import { CreateManufacturingOrder } from '../orders/order_create'
import {
  DetailSt,
  type DetailStProp,
  type LastProduction,
} from './detail.state'
import { api } from './detail_api'
import { DetailForm } from './detail_form'
import { DetailDeficitIndicator } from './detail_stock_delta'

export const CreateDetailPage = observer(() => {
  const [detail] = useState(() => new DetailSt())
  const navigate = useNavigate()
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={'Добавить деталь'} />
      <DetailForm detail={detail} />
      <ActionButton
        onClick={() =>
          api.insert(detail).then(id => {
            if (id != null) {
              navigate(openPage(routeMap.pdo.detail.edit, id))
            }
          })
        }
      />
    </Stack>
  )
})

export const DetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    throw new Error('Invalid page params; id is required')
  }
  const [detail, setDetail] = useState<DetailSt | null>(null)

  useEffect(() => {
    api.get(Number(id)).then(d => {
      setDetail(d)
    })
  }, [id])

  if (api.loader.loading || !detail) return <Loading />
  return (
    <Stack sx={{ flex: 1 }}>
      <MetalPageTitle
        spaceBetween={false}
        t={
          Boolean(detail.id) && (
            <P level="body-md" whiteSpace={'nowrap'}>
              Деталь № {detail.id}
            </P>
          )
        }
      >
        <Row>
          <CreateManufacturingOrder detailId={detail.id} />
          <Save detail={detail} />
        </Row>
      </MetalPageTitle>

      <Row flexWrap={'wrap'} gap={1} py={0.5}></Row>
      <DetailForm
        detail={detail}
        afterName={
          <Stack>
            <DetailDeficitIndicator deficit={detail.deficit} />
            {detail.current_manufacturing && (
              <DetailProductionIndicator order={detail.current_manufacturing} />
            )}
          </Stack>
        }
      />
      <Metadata
        updated_at={detail.updated_at}
        last_production={detail.last_production}
      />
    </Stack>
  )
})

const DetailProductionIndicator = ({
  order,
}: {
  order: {
    id: number
    qty: number
    started_at: Date | null
  }
}) => {
  const daysInProduction = order.started_at
    ? fmt.day_count(
        (Date.now() - order.started_at.getTime()) / (1000 * 60 * 60 * 24),
      )
    : null

  return (
    <Row gap={0.75} flexWrap="nowrap">
      <Indicator title="В производстве" color="orange" />
      <P level="body-xs">
        В производстве {order.qty} шт. —{' '}
        <Link to={openPage(routeMap.pdo.order.edit, order.id)}>
          заказ № {order.id}
        </Link>
        {daysInProduction && `, уже ${daysInProduction}`}
      </P>
    </Row>
  )
}

const Save = observer(({ detail }: DetailStProp) => {
  const navigate = useNavigate()
  return (
    <SaveAndDelete
      sx={{ flexWrap: 'nowrap', gap: 1 }}
      itemName={`Деталь (${detail.id}) - ${detail.name}`}
      handleDelete={() =>
        api.delete(detail.id).then(() => {
          navigate(openPage(routeMap.pdo.details))
        })
      }
      handleSave={() => api.update(detail)}
    />
  )
})

function Metadata(props: {
  updated_at: Date | null
  last_production: LastProduction | null
}) {
  return (
    <Stack gap={0.5}>
      {props.last_production?.date && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Последнее производство:</b>{' '}
          {fmtTimestamp(props.last_production.date)}
          {props.last_production.qty && (
            <span> ({props.last_production.qty} шт)</span>
          )}
        </P>
      )}
      {props.updated_at && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Обновлено:</b> {fmtDate(props.updated_at)}
        </P>
      )}
    </Stack>
  )
}
