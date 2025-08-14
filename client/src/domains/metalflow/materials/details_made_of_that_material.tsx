/** @jsxImportSource @emotion/react */
import { Button, List } from '@mui/joy'
import { InModal } from 'components/modal'
import { DetailName } from 'domains/metalflow/details/name'
import { Link, Loading, observer, P, Stack } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { detailList } from './detail_list_store'
import { material } from './store'

export const DetailsMadeOfMaterialModal = observer(() => {
  if (!material.id) return null
  const count =
    material?.detailCount > 0 ? `[${material.detailCount}]` : undefined

  const isEmptyList =
    !detailList.async.loading &&
    detailList.detailsMadeFromThisMaterial.length === 0

  return (
    <InModal
      openButton={
        <Button variant="soft" color="neutral">
          Детали {count}
        </Button>
      }
      open={detailList.detailsModalOpen}
      setOpen={open => {
        detailList.setDetailsModalOpen(open, material.id!)
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
