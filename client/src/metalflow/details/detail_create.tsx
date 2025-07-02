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
  DetailGroupInput,
  DetailNameInput,
  DetailPartCodeInput,
  MaterialRelationDataInputs
} from './detail_shared'
export const CreateDetailPage = observer(() => {
  useEffect(() => {
    return () => {
      detailStore.reset()
    }
  }, [])
  return (
    <Stack gap={1} py={2}>
      <PageTitle subTitle={t.AddDetail} hideIcon />
      <DetailNameInput />
      <DetailGroupInput />
      <DetailPartCodeInput />
      <MaterialRelationDataInputs />
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
