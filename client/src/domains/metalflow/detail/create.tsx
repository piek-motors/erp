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
import { api } from './api'
import { DetailInputs } from './components'

export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      api.detail.reset()
    }
  }, [])
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={t.AddDetail} />
      <DetailInputs />
      <ExecuteAction
        onSubmit={() => api.insert()}
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
