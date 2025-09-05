import { ScrollableWindow } from 'components/inputs'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import {
  Box,
  MobileOnly,
  observer,
  Row,
  RowButColumsAtSm,
  Stack,
  useEffect
} from 'lib/index'
import { ReactNode } from 'react'
import { useParams } from 'react-router'
import { crud } from './api'
import { GroupActions, TargetGroupDetailList } from './detail_list'
import { DesktopGroupList, GroupSelectModal } from './group_list'
import { UpdateGroupNameModal } from './group_name.modal'

interface DetailGroupsLayoutProps {
  children?: ReactNode
}

const DetailGroupsLayout = observer((props: DetailGroupsLayoutProps) => (
  <RowButColumsAtSm>
    {/* Group list */}
    <Box>
      <MetalPageTitle t="Группы">
        <MobileOnly>
          <GroupSelectModal />
        </MobileOnly>
      </MetalPageTitle>

      <DesktopGroupList />
    </Box>
    {/* Group details */}
    <Box>
      <ScrollableWindow
        staticContent={
          <Row p={0.4}>
            <UpdateGroupNameModal />
            <GroupActions />
          </Row>
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
