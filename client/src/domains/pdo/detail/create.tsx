import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  ExecuteAction,
  observer,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { api } from './api'
import { DetailInputs } from './components'

export const CreateDetailPage = observer(() => {
  useEffect(() => {
    api.detail.reset()
  }, [])
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={'Добавить деталь'} />
      <DetailInputs />
      <ExecuteAction
        onSubmit={() => api.insert()}
        additionals={(err, res) => {
          if (!res) return null
          return (
            <TakeLookHint
              text={'Добавлена новая деталь'}
              link={openPage(routeMap.pdo.detail.edit, res.id)}
            />
          )
        }}
      />
    </Stack>
  )
})
