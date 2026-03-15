import { Button, Divider } from '@mui/joy'
import { useParams } from 'react-router'
import { ScrollableWindow } from '@/components/inputs'
import {
  DesktopOnly,
  MobileOnly,
} from '@/components/utilities/conditional-display'
import { Box, observer, Row, Stack, useEffect } from '@/lib/index'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { api } from './api'
import { GroupContentSection } from './group_content'
import { GroupList, MobileGroupSelectModal } from './group_list'

export const GroupListPage = observer(() => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        api.load_group_with_details(groupId)
      }
    }
  }, [id])

  return <DetailGroupsLayout />
})

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
    <GroupContentSection />
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
