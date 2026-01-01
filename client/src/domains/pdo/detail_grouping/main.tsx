import { Divider } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import {
  DesktopOnly,
  MobileOnly
} from 'components/utilities/conditional-display'
import { Box, Loading, observer, P, Row, Stack, useEffect } from 'lib/index'
import { useParams } from 'react-router'
import { MobileNavModal } from '../root_layout'
import { crud } from './api'
import { GroupActions, TargetGroupDetailList } from './detail_list'
import { GroupSelectModal, SharedGroupList } from './group_list'
import { UpdateGroupNameModal } from './group_name.modal'

const DetailsPanel = observer(() => {
  if (crud.targetGroupLoading.loading) return <Loading />
  const openedGroup = crud.store.targetGroup
  if (!openedGroup)
    return (
      <P level="body-sm" p={2}>
        Выберите группу
      </P>
    )
  return (
    <ScrollableWindow
      scroll={
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
    />
  )
})

const DetailGroupsLayout = observer(() => (
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
        <Row>
          <MobileNavModal />
          <GroupSelectModal />
        </Row>
      </MobileOnly>
      <DesktopOnly>
        <ScrollableWindow scroll={<SharedGroupList />} />
      </DesktopOnly>
    </Box>
    {/* Group details */}
    <Divider orientation="vertical" />
    <DetailsPanel />
  </Stack>
))

export const DetailGroupById = observer(() => {
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        crud.loadGroupWithDetails(groupId)
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
    crud.listGroups()
    return () => {
      crud.store.clear()
    }
  }, [])
  return <DetailGroupsLayout />
})
