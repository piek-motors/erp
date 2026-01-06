import { Sheet, Stack } from '@mui/joy'
import { SaveAndDelete } from 'domains/pdo/shared/basic'
import {
  Loading,
  observer,
  openPage,
  P,
  routeMap,
  Row,
  RowButColumsAtSm,
  useEffect,
  useNavigate,
  useParams,
  useState
} from 'lib/index'
import { fmtDate, fmtTimestamp } from 'lib/utils/date_fmt'
import { CreateDetailOrder } from '../warehouse/create_order'
import { api } from './api'
import { DetailSt, DetailStProp } from './detail.state'
import { DetailInputs } from './inputs'
import { DetailWarehouse } from './warehouse/ui'

export const UpdateDetailPage = observer(() => {
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
    <Sheet sx={{ p: 1 }}>
      <RowButColumsAtSm gap={1} flexGrow={4}>
        <Stack gap={1} alignItems={'center'}>
          <DetailWarehouse detail={detail} />
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
    </Sheet>
  )
})

function SaveFloatingButton({ detail }: DetailStProp) {
  const navigate = useNavigate()
  return (
    <Sheet
      sx={{
        borderRadius: 'sm',
        backgroundColor: 'lightgray',
        position: 'sticky',
        bottom: 0,
        width: 'min-content',
        p: 1,
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
          handleSave={() => api.update(detail)}
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
          {fmtTimestamp(props.lastManufacturingDate)}
          {props.lastManufacturingQty && (
            <span> ({props.lastManufacturingQty} шт)</span>
          )}
        </P>
      )}
      {props.updatedAt && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Обновлено:</b> {fmtDate(props.updatedAt)}
        </P>
      )}
    </Stack>
  )
}
