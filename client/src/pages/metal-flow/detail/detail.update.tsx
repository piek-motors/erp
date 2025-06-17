import { Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { open, routeMap } from 'lib/routes'
import { DeleteResourceButton, Inp, P, Row, SendMutation } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { detailStore } from '../store'
import { t } from '../text'
import { DetailMaterialSelectForm } from './detail.shared'

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
      <Stack gap={2}>
        <P>
          <b>ID</b> {detailStore.id}
        </P>
        <Inp
          fullWidth
          label={t.DetailName}
          onChange={v => {
            detailStore.setName(v)
          }}
          value={detailStore.name}
        />
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
    </Stack>
  )
})
