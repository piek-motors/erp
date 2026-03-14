import { Button, Divider } from '@mui/joy'
import { useParams } from 'react-router'
import { ScrollableWindow } from '@/components/inputs'
import {
  DesktopOnly,
  MobileOnly,
} from '@/components/utilities/conditional-display'
import { Box, Loading, observer, P, Row, Stack, useEffect } from '@/lib/index'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { api, store } from './api'
import { GroupContent } from './group_content'
import { GroupList, MobileGroupSelectModal } from './group_list'

const DetailGroupsLayout = () => (
  <Stack
    direction={{
      xs: 'column',
      sm: 'row',
    }}
    sx={{
      gap: 0.5,
    }}
  >
    {/* Group list */}
    <Box>
      <MobileLayout />
      <DesktopOnly>
        <ScrollableWindow scroll={<GroupList />} storageKey="pdo-group-list" />
      </DesktopOnly>
    </Box>
    {/* Group details */}
    <Divider orientation="vertical" />
    <DetailsPanel />
  </Stack>
)

const MobileLayout = () => (
  <MobileOnly>
    <MobilePadding>
      <Row>
        <MobileNavModal />
        <MobileGroupSelectModal
          open_button={
            <Button variant="solid" color="primary" size="sm">
              Группы
            </Button>
          }
        />
      </Row>
    </MobilePadding>
  </MobileOnly>
)

const DetailsPanel = observer(() => {
  if (api.details_loading.loading) return <Loading />
  if (!store.group)
    return (
      <P level="body-sm" p={2}>
        Выберите группу
      </P>
    )
  return <ScrollableWindow scroll={<GroupContent />} />
})

export const GroupById = observer(() => {
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        api.load_group_with_details(groupId)
      }
    }
    return () => {
      store.clear()
    }
  }, [id])

  return <DetailGroupsLayout />
})

export const GroupListPage = observer(() => {
  useEffect(() => {
    api.list_groups()
    return () => {
      store.clear()
    }
  }, [])
  return <DetailGroupsLayout />
})
