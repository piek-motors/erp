import { Stack } from '@mui/joy'
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
  DetailGroupInput,
  DetailNameInput,
  DetailPartCodeInput,
  MaterialRelationDataInputs
} from './shared'

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
    <Stack gap={1} py={2}>
      <PageTitle subTitle={t.EditDetail} hideIcon />
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
          <DetailGroupInput />
          <DetailPartCodeInput />
          <MaterialRelationDataInputs />
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
        <Stack gap={1} sx={{ flex: 0.6 }}>
          <DetailAttachmentList detailId={detailId} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})
