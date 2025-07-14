import { Box, Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import {
  observer,
  open,
  P,
  routeMap,
  RowButColumsAtSm,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { SaveAndDelete } from 'metalflow/shared/basic'
import { t } from '../text'
import { DetailAttachmentList } from './attachments/detail_attachment_list'
import { detailStore } from './detail.store'
import {
  DetailDescriptionInput,
  DetailGroupInput,
  DetailNameInput,
  DetailParamsInput,
  DetailPartCodeInput,
  MaterialRelationDataInputs
} from './shared'
import { StartManufacturing } from './start-manufacturing'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)
  const navigate = useNavigate()
  useEffect(() => {
    detailStore.load(detailId)
    return () => {
      detailStore.reset()
    }
  }, [])
  return (
    <Stack gap={1} p={1}>
      <PageTitle title={t.EditDetail} />
      <RowButColumsAtSm gap={1}>
        {/* Left Column - Detail Info */}
        <Stack gap={0.5} sx={{ flex: 1 }}>
          <P>
            <b>ID</b> {detailStore.id}
          </P>
          <DetailNameInput />
          {/* <WarehouseOperationsLinks
            onSupplyClick={() => {
              // navigate(open(routeMap.metalflow.supply.new, detailId))
            }}
            onWriteoffClick={() => {
              // navigate(open(routeMap.metalflow.writeoff.new, detailId))
            }}
          /> */}
          <Box>
            <StartManufacturing />
          </Box>
          <DetailGroupInput />
          <DetailPartCodeInput />
          <DetailParamsInput />
          <MaterialRelationDataInputs />
          <DetailDescriptionInput />
          <SaveAndDelete
            itemName={`Деталь (${detailStore.id}) - ${detailStore.name}`}
            handleDelete={() =>
              detailStore.delete().then(() => {
                navigate(open(routeMap.metalflow.details))
              })
            }
            handleSave={() => detailStore.update()}
          />
        </Stack>
        {/* Right Column - Documents */}
        <Stack gap={1} sx={{ flex: 1 }}>
          <DetailAttachmentList detailId={detailId} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})
