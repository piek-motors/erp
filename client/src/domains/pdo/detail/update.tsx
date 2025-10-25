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
  useParams
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { formatDate, formatDetailDateTime } from 'lib/utils/formatting'
import { CreateDetailOrder } from '../warehouse/create_order'
import { api } from './api'
import { DetailAttachmentList } from './attachment/list'
import { DetailInputs } from './components'
import { DetailWarehouse } from './warehouse/ui'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')

  useEffect(() => {
    api.reset()
    api.loadFull(Number(id))
  }, [id])

  if (api.status.loading) return <Loading />
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
            <DetailWarehouse />
            <Card size="sm" sx={{ width: 'min-content' }}>
              <DetailAttachmentList detailId={Number(id)} />
            </Card>
          </StackButRowAtSm>
          <CreateDetailOrder />
        </Stack>

        <Stack gap={2} sx={{ flex: 1 }}>
          <DetailInputs />
          <Metadata
            updatedAt={api.detail.updatedAt}
            lastManufacturingDate={api.detail.lastManufacturingDate}
            lastManufacturingQty={api.detail.lastManufacturingQty}
          />
          <SaveFloatingButton />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})

function SaveFloatingButton() {
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
          itemName={`Деталь (${api.detail.id}) - ${api.detail.name}`}
          handleDelete={() =>
            api.delete().then(() => {
              navigate(openPage(routeMap.pdo.details))
            })
          }
          handleSave={() =>
            api.update().then(() => notifier.ok('Деталь обновлена'))
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
