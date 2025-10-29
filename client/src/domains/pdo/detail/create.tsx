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
import { DetailInputs } from './components'
import { DetailState } from './detail.state'

export const CreateDetailPage = observer(() => {
  const [detail, setDetail] = useState(() => new DetailState())
  const [insertedDetailId, setInsertedDetailId] = useState<number | null>(null)
  return (
    <Stack gap={2} p={1}>
      <MetalPageTitle t={'Добавить деталь'} />
      {insertedDetailId && (
        <TakeLookHint
          text="Перейти к добавленной детали"
          link={openPage(routeMap.pdo.detail.edit, insertedDetailId)}
        />
      )}
      <DetailInputs detail={detail} />
      <ActionButton
        onClick={() =>
          api.insert(detail).then(id => {
            setInsertedDetailId(id)
            setDetail(new DetailState())
          })
        }
      />
    </Stack>
  )
})
