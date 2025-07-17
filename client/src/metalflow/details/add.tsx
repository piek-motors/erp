import { PageTitle } from 'components/page-title'
import {
  observer,
  SendMutation,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { t } from '../text'
import { detailStore } from './detail.store'
import {
  DetailDescriptionInput,
  DetailGroupInput,
  DetailNameInput,
  DetailParamsInput,
  DetailPartCodeInput,
  MaterialCostInputs
} from './shared'
export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      detailStore.reset()
    }
  }, [])
  return (
    <Stack gap={1} p={1}>
      <PageTitle title={t.AddDetail} />
      <DetailNameInput />
      <DetailGroupInput />
      <DetailPartCodeInput />
      <DetailParamsInput />
      <MaterialCostInputs />
      <DetailDescriptionInput />
      <SendMutation
        onClick={() => detailStore.insert()}
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
