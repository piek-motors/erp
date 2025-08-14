/** @jsxImportSource @emotion/react */
import { Button, List } from '@mui/joy'
import { InModal } from 'components/modal'
import { DetailName } from 'domains/metalflow/detail/name'
import { useEscapeClose } from 'hooks/use-escape-close'
import {
  Link,
  Loading,
  observer,
  P,
  Stack,
  useCallback,
  useState
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { api } from './api'
import { detailList } from './detail_list.store'

export const DetailsMadeOfMaterialModal = observer(() => {
  const count = api.s.detailCount > 0 ? `[${api.s.detailCount}]` : undefined

  const [modal, setModal] = useState(false)
  const handleClose = useCallback(() => {
    setModal(false)
  }, [])
  useEscapeClose(modal, handleClose)

  const isEmptyList =
    !detailList.async.loading &&
    detailList.detailsMadeFromThisMaterial.length === 0

  if (!api.s.id) return null

  return (
    <InModal
      openButton={
        <Button variant="soft" color="neutral">
          Детали {count}
        </Button>
      }
      open={modal}
      setOpen={() => {
        setModal(true)
        detailList.loadDetails(api.s.id!)
      }}
    >
      <Stack gap={2} sx={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <P fontWeight={600}>Детали из этого материала</P>
        {detailList.async.loading && <Loading />}
        <List>
          {detailList.detailsMadeFromThisMaterial.map(each => (
            <Link to={open(routeMap.metalflow.detail.edit, each.id)}>
              <DetailName detail={each} />
            </Link>
          ))}
          {isEmptyList && <P>Этот материал не используется в деталях</P>}
        </List>
      </Stack>
    </InModal>
  )
})
