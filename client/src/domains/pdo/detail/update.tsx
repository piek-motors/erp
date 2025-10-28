import { Card, Sheet, Stack } from '@mui/joy'
import { MetalPageTitle, SaveAndDelete } from 'domains/pdo/shared/basic'
import {
  Loading,
  observer,
  openPage,
  P,
  routeMap,
  Row,
  RowButColumsAtSm,
  StackButRowAtSm,
  useEffect,
  useNavigate,
  useParams,
  useState
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { formatDate, formatDetailDateTime } from 'lib/utils/formatting'
import { CreateDetailOrder } from '../warehouse/create_order'
import { api } from './api'
import { DetailAttachmentList } from './attachment/list'
import { DetailInputs } from './components'
import { DetailState } from './detail.state'
import { DetailWarehouse } from './warehouse/ui'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    throw new Error('Invalid page params; id is required')
  }
  const [detail, setDetail] = useState<DetailState | null>(null)

  useEffect(() => {
    api.loadFull(Number(id)).then(d => {
      setDetail(d)
    })
  }, [id])

  if (api.loader.loading || !detail) return <Loading />
  return (
    <Stack>
      <MetalPageTitle
        t={
          <P level="body-sm" whiteSpace={'nowrap'}>
            Деталь № {id}
          </P>
        }
      />
      <RowButColumsAtSm gap={1} flexGrow={4}>
        <Stack gap={1}>
          <StackButRowAtSm gap={1} sx={{ flex: 0 }}>
            <DetailWarehouse detail={detail} />
            <Card size="sm" sx={{ width: 'min-content' }}>
              <DetailAttachmentList detail={detail} />
            </Card>
          </StackButRowAtSm>
          <CreateDetailOrder detailId={detail.id} />
        </Stack>

        <Stack gap={2} sx={{ flex: 1 }}>
          <DetailInputs detail={detail} />
          <Metadata
            updatedAt={detail.updatedAt}
            lastManufacturingDate={detail.lastManufacturingDate}
            lastManufacturingQty={detail.lastManufacturingQty}
          />
          <SaveFloatingButton detail={detail} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})

function SaveFloatingButton({ detail }: { detail: DetailState }) {
  const navigate = useNavigate()
  return (
    <Sheet
      sx={{
        borderRadius: 'sm',
        backgroundColor: 'lightblue',
        position: 'sticky',
        bottom: 0,
        width: 'min-content',
        px: 3,
        py: 0.5,
        height: 'min-content'
      }}
    >
      <Row>
        <SaveAndDelete
          itemName={`Деталь (${detail.id}) - ${detail.name}`}
          handleDelete={() =>
            api.delete(detail.id).then(() => {
              navigate(openPage(routeMap.pdo.details))
            })
          }
          handleSave={() =>
            api.update(detail).then(() => notifier.ok('Деталь обновлена'))
          }
        />
      </Row>
    </Sheet>
  )
}

function Metadata(props: {
  updatedAt?: Date
  lastManufacturingDate?: Date
  lastManufacturingQty?: number
}) {
  return (
    <Stack gap={0.5}>
      {props.lastManufacturingDate && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Последнее производство:</b>{' '}
          {formatDetailDateTime(props.lastManufacturingDate)}
          {props.lastManufacturingQty && (
            <span> ({props.lastManufacturingQty} шт)</span>
          )}
        </P>
      )}
      {props.updatedAt && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Обновлено:</b> {formatDate(props.updatedAt)}
        </P>
      )}
    </Stack>
  )
}
