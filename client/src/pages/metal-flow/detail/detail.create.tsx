import { Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { open, routeMap } from 'lib/routes'
import { Inp, SendMutation, TakeLookHint } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { detailStore } from '../store'
import { t } from '../text'
import { DetailMaterialSelectForm } from './detail.shared'

export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      detailStore.clear()
    }
  }, [])

  return (
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.AddDetail} hideIcon />
      <Inp
        label={t.DetailName}
        onChange={v => {
          detailStore.setName(v)
        }}
        value={detailStore.name}
      />
      <DetailMaterialSelectForm />
      <SendMutation
        onClick={() => detailStore.insert()}
        additionals={(err, mutationResult) => (
          <TakeLookHint
            text={t.RecentlyNewDetailAdded}
            link={open(routeMap.metalflow.detail.edit, mutationResult.id)}
          />
        )}
      />
    </Stack>
  )
})
