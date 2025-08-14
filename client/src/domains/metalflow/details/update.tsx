import { Box, Sheet, Stack } from '@mui/joy'
import { MetalPageTitle, SaveAndDelete } from 'domains/metalflow/shared/basic'
import {
  Loading,
  observer,
  open,
  P,
  routeMap,
  RowButColumsAtSm,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { formatDetailDate } from 'lib/utils/formatting'
import { DetailAttachmentList } from './attachments/detail_attachment_list'
import { CreateManufacturingOrder } from './create_manufacturing_order'
import { DetailInputs } from './shared'
import { detailStore } from './store'
import { DetailWarehouse } from './warehouse/ui'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)
  const navigate = useNavigate()
  useEffect(() => {
    detailStore.loadFullInfo(detailId)
    return () => {
      detailStore.reset()
    }
  }, [])

  if (detailStore.async.loading) {
    return <Loading />
  }

  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={`Деталь #${detailStore.id} - ${detailStore.name}`} />
      <RowButColumsAtSm gap={1} flexGrow={4}>
        <DetailWarehouse />
        <Stack gap={2} sx={{ flex: 1 }}>
          <CreateManufacturingOrder />
          <DetailInputs />
          <Box width={'min-content'}>
            <Metadata
              updatedAt={detailStore.updatedAt}
              lastManufacturingDate={detailStore.lastManufacturingDate}
              lastManufacturingQty={detailStore.lastManufacturingQty}
            />
            <SaveAndDelete
              itemName={`Деталь (${detailStore.id}) - ${detailStore.name}`}
              handleDelete={() =>
                detailStore.delete().then(() => {
                  navigate(open(routeMap.metalflow.details))
                })
              }
              handleSave={() => detailStore.update()}
            />
          </Box>
        </Stack>
        <Stack gap={1} sx={{ flex: 0 }}>
          <Sheet sx={{ p: 1, borderRadius: 'sm' }}>
            <DetailAttachmentList detailId={detailId} />
          </Sheet>
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})

function Metadata(props: {
  updatedAt?: Date
  lastManufacturingDate?: Date
  lastManufacturingQty?: number
}) {
  return (
    <Stack gap={0.5} sx={{ mt: 1 }}>
      {props.lastManufacturingDate && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Последнее производство:</b>{' '}
          {formatDetailDate(props.lastManufacturingDate)}
          {props.lastManufacturingQty && (
            <span> ({props.lastManufacturingQty} шт)</span>
          )}
        </P>
      )}
      {props.updatedAt && (
        <P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Обновлено:</b> {formatDetailDate(props.updatedAt)}
        </P>
      )}
    </Stack>
  )
}
