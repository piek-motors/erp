import { Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import {
  DeleteResourceButton,
  observer,
  P,
  Row,
  RowButColumsAtSm,
  SendMutation,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { detailStore } from '../store'
import { t } from '../text'
import { DetailAttachmentList } from './detail_attachment_list'
import {
  DetailNameInput,
  DetailPartCodeInput,
  MaterialialsSelect,
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
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.EditDetail} hideIcon />
      <RowButColumsAtSm gap={3}>
        {/* Left Column - Detail Info */}
        <Stack gap={2} sx={{ flex: 1 }}>
          <P>
            <b>ID</b> {detailStore.id}
          </P>
          <DetailNameInput />
          <DetailPartCodeInput />
          <MaterialialsSelect />
          <MaterialRelationDataInputs />
          <Row alignItems={'end'}>
            <SendMutation
              onClick={() => detailStore.update()}
              stackProps={{ sx: { flexGrow: 1 } }}
              buttonProps={{
                fullWidth: true
              }}
            />
            <DeleteResourceButton
              onClick={() =>
                detailStore.delete().then(() => {
                  navigate(open(routeMap.metalflow.details))
                })
              }
            />
          </Row>
        </Stack>

        {/* Right Column - Documents */}
        <Stack gap={1} sx={{ flex: 0.6 }}>
          <DetailAttachmentList detailId={detailId} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})
