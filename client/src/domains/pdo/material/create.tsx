import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  ActionButton,
  observer,
  Stack,
  TakeLookHint,
  useState
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { api } from './api'
import { MaterialFormFields } from './form-fields'
import { MaterialState } from './state'

export const CreateMaterialPage = observer(() => {
  const [material, setMaterial] = useState(() => new MaterialState())
  const [insertedMaterialId, setInsertedMaterialId] = useState<number | null>(
    null
  )
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={'Добавить материал'} />
      {insertedMaterialId && (
        <TakeLookHint
          text="Перейти к добавленному материалу"
          link={openPage(routeMap.pdo.material.edit, insertedMaterialId)}
        />
      )}
      <Stack gap={1}>
        <MaterialFormFields showTabs m={material} />
        <ActionButton
          onClick={() =>
            api.insert(material).then(id => {
              setInsertedMaterialId(id)
              setMaterial(new MaterialState())
            })
          }
        />
      </Stack>
    </Stack>
  )
})
