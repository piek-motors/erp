import { Divider } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Box,
  DesktopOnly,
  Loading,
  MobileOnly,
  observer,
  Row,
  Stack,
  useEffect
} from 'lib/index'
import { ReactNode } from 'react'
import { useParams } from 'react-router'
import { crud } from './api'
import { GroupActions, TargetGroupDetailList } from './detail_list'
import { GroupSelectModal, SharedGroupList } from './group_list'
import { UpdateGroupNameModal } from './group_name.modal'

interface DetailGroupsLayoutProps {
  children?: ReactNode
}

const Detauls = observer(() => {
  if (crud.targetGroupLoading.loading) return <Loading />
  const openedGroup = crud.store.targetGroup
  return (
    <Box>
      <ScrollableWindow
        scrollableContent={
          openedGroup && (
            <Stack p={1}>
              <Row>
                <UpdateGroupNameModal />
                <GroupActions />
              </Row>
              <Divider sx={{ my: 0.5 }} />
              <TargetGroupDetailList />
            </Stack>
          )
        }
        refreshTrigger={null}
      />
    </Box>
  )
})

const DetailGroupsLayout = observer((props: DetailGroupsLayoutProps) => (
  <Stack
    direction={{
      xs: 'column',
      sm: 'row'
    }}
    sx={{
      gap: 0.5,
      p: {
        xs: 1,
        sm: 0
      }
    }}
  >
    {/* Group list */}
    <Box>
      <MobileOnly>
        <MetalPageTitle t="Группы">
          <GroupSelectModal />
        </MetalPageTitle>
      </MobileOnly>
      <DesktopOnly>
        <ScrollableWindow scrollableContent={<SharedGroupList />} />
      </DesktopOnly>
    </Box>
    {/* Group details */}
    <Detauls />
  </Stack>
))

export const DetailGroupById = observer(() => {
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        crud.loadGroupWithDetails(groupId)
        crud.loadAvailableUniversalDetails()
      }
    }
    return () => {
      crud.store.clear()
    }
  }, [id])

  return <DetailGroupsLayout />
})

export const DetailGroupListPage = observer(() => {
  useEffect(() => {
    crud.loadGroups()
    crud.loadAvailableUniversalDetails()
    return () => {
      crud.store.clear()
    }
  }, [])
  return <DetailGroupsLayout />
})
