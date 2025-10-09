import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  ExecuteAction,
  observer,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { t } from '../text'
import { api } from './api'
import { MaterialFormFields } from './form-fields'

export const MaterialAddPage = observer(() => {
  useEffect(() => {
    api.reset()
  }, [])
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={'Добавить материал'} />
      <Stack gap={1}>
        <MaterialFormFields showTabs />
        <ExecuteAction onSubmit={() => api.insert()} width="fit-content" />
        {api.s.insertedMaterialId && (
          <TakeLookHint
            text={t.RecentlyNewMaterialAdded}
            link={openPage(
              routeMap.metalflow.material.edit,
              api.s.insertedMaterialId
            )}
          />
        )}
      </Stack>
    </Stack>
  )
})
