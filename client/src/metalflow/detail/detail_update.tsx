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
import { detailStore } from '../store'
import { t } from '../text'
import { DetailAttachmentList } from './detail_attachment_list'
import {
  DetailNameInput,
  DetailPartCodeInput,
  MaterialRelationDataInputs
} from './detail_shared'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)

  const navigate = useNavigate()

  useEffect(() => {
    detailStore.load(detailId)
    detailStore.loadMaterials()
    return () => {
      detailStore.clear()
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
