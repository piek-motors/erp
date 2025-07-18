import { ScrollableWindow } from 'components/inputs'
import {
  Box,
  observer,
  Row,
  RowButColumsAtSm,
  Stack,
  useEffect
} from 'lib/index'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { GroupActions, TargetGroupDetailList } from './detail_list'
import { DesktopGroupList, MobileGroupList } from './group_list'
import { UpdateGroupNameModal } from './group_name.modal'
import { store } from './store'

interface DetailGroupsLayoutProps {
  children?: ReactNode
}

const DetailGroupsLayout = observer((props: DetailGroupsLayoutProps) => (
  <RowButColumsAtSm>
    {/* Group list */}
    <Box p={1}>
      <MetalPageTitle title="Группы деталей" hideIcon spaceBetween>
        <MobileGroupList />
      </MetalPageTitle>

      <DesktopGroupList />
    </Box>
    {/* Group details */}
    <Box>
      <ScrollableWindow
        staticContent={
          store.targetGroup && (
            <Row p={1} gap={1}>
              <UpdateGroupNameModal />
              <GroupActions />
            </Row>
          )
        }
        scrollableContent={
          <Stack p={1} px={2}>
            <TargetGroupDetailList />
          </Stack>
        }
        refreshTrigger={null}
      />
    </Box>
  </RowButColumsAtSm>
))

export const DetailGroupById = observer(() => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        store.loadGroupWithDetails(groupId)
        store.loadAvailableUniversalDetails()
      }
    }
    return () => {
      store.clear()
    }
  }, [id])
  return <DetailGroupsLayout />
})

export const DetailGroupListPage = observer(() => {
  useEffect(() => {
    store.loadGroups()
    store.loadAvailableUniversalDetails()
    return () => {
      store.clear()
    }
  }, [])
  return <DetailGroupsLayout />
})
