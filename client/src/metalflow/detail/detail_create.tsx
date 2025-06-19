import { PageTitle } from 'components/page-title'
import {
  observer,
  SendMutation,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { detailStore } from '../store'
import { t } from '../text'
import {
  DetailMaterialSelectForm,
  DetailNameInput,
  DetailPartCodeInput
} from './detail_shared'

export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      detailStore.clear()
    }
  }, [])

  return (
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.AddDetail} hideIcon />
      <DetailNameInput />
      <DetailPartCodeInput />
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
