import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import {
  ExecuteAction,
  observer,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { t } from '../text'
import { DetailInputs } from './shared'
import { detailStore } from './store'

export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      detailStore.reset()
    }
  }, [])
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={t.AddDetail} />
      <DetailInputs />
      <ExecuteAction
        onSubmit={() => detailStore.insert()}
        additionals={(err, res) => {
          if (!res) return null
          return (
            <TakeLookHint
              text={t.RecentlyNewDetailAdded}
              link={open(routeMap.metalflow.detail.edit, res.id)}
            />
          )
        }}
      />
    </Stack>
  )
})
