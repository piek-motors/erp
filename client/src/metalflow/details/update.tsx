import { Box, Stack } from '@mui/joy'
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
import { MetalPageTitle, SaveAndDelete } from 'metalflow/shared/basic'
import { DetailAttachmentList } from './attachments/detail_attachment_list'
import { CreateManufacturingOrder } from './create_manufacturing_order'
import { detailStore } from './detail.store'
import {
  DetailDescriptionInput,
  DetailGroupInput,
  DetailNameInput,
  DetailParamsInput,
  DetailPartCodeInput,
  MaterialCostInputs
} from './shared'

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
      <RowButColumsAtSm gap={1}>
        <Stack gap={0.5} sx={{ flex: 1 }}>
          <P>
            <b>Остаток:</b> {detailStore.stock} шт
          </P>

          <CreateManufacturingOrder />
          <DetailNameInput />
          <DetailGroupInput />
          <DetailPartCodeInput />
          <DetailParamsInput />
          <MaterialCostInputs />
          <DetailDescriptionInput />
          <Box width={'min-content'}>
            <SaveAndDelete
              itemName={`Деталь (${detailStore.id}) - ${detailStore.name}`}
              handleDelete={() =>
                detailStore.delete().then(() => {
                  navigate(open(routeMap.metalflow.details))
                })
              }
              handleSave={() => detailStore.update()}
            />
            <DetailInfo
              updatedAt={detailStore.updatedAt}
              lastManufacturingDate={detailStore.lastManufacturingDate}
              lastManufacturingQty={detailStore.lastManufacturingQty}
            />
          </Box>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <DetailAttachmentList detailId={detailId} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})

function DetailInfo(props: {
  updatedAt?: Date
  lastManufacturingDate?: Date
  lastManufacturingQty?: number
}) {
  return (
    <Stack gap={0.5} sx={{ mt: 1 }}>
      {props.lastManufacturingDate && (
        <P level="body-sm" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Последнее производство:</b>{' '}
          {formatDetailDate(props.lastManufacturingDate)}
          {props.lastManufacturingQty && (
            <span> ({props.lastManufacturingQty} шт)</span>
          )}
        </P>
      )}
      {props.updatedAt && (
        <P level="body-sm" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
          <b>Обновлено:</b> {formatDetailDate(props.updatedAt)}
        </P>
      )}
    </Stack>
  )
}
