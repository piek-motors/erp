import { ScrollableWindow } from 'components/inputs'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Box,
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
import { DesktopGroupList, GroupSelectModal } from './group_list'
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
        staticContent={
          <Row p={0.4}>
            <UpdateGroupNameModal />
            <GroupActions />
          </Row>
        }
        scrollableContent={
          openedGroup && (
            <Stack p={1} px={2}>
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
      gap: 1,
      p: {
        xs: 1,
        sm: 0
      }
    }}
  >
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
