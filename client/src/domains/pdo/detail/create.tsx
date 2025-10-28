import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { ExecuteAction, observer, Stack, TakeLookHint } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { api } from './api'
import { DetailInputs } from './components'
import { DetailState } from './detail.state'

export const CreateDetailPage = observer(() => {
  const detail = new DetailState()
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={'Добавить деталь'} />
      <DetailInputs detail={detail} />
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
