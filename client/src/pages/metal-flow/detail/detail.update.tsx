import { Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { open, routeMap } from 'lib/routes'
import {
  DeleteResourceButton,
  P,
  Row,
  RowButColumsAtSm,
  SendMutation
} from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { detailStore } from '../store'
import { t } from '../text'
import { DetailAttachmentList } from './detail-attachment-list'
import {
  DetailMaterialSelectForm,
  DetailNameInput,
  DetailPartCodeInput
} from './detail.shared'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)

  const navigate = useNavigate()

  useEffect(() => {
    detailStore.load(detailId)
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
          <DetailMaterialSelectForm />

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
