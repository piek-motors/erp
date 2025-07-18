import { ScrollableWindow } from 'components/inputs'
import { Box, observer, Row, RowButColumsAtSm, Stack } from 'lib/index'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { ReactNode } from 'react'
import { CreateGroupModal } from './create-group.modal'
import { DetailGroupList } from './group_list'

interface DetailGroupsLayoutProps {
  children: ReactNode
  showGroupList?: boolean
}

export const DetailGroupsLayout = observer(
  ({ children, showGroupList = true }: DetailGroupsLayoutProps) => {
    return (
      <RowButColumsAtSm>
        <Box sx={{ minWidth: '300px' }}>
          <ScrollableWindow
            scrollableContent={
              <Stack p={1} gap={0}>
                <Row justifyContent="space-between">
                  <MetalPageTitle title="Группы" hideIcon />
                  <CreateGroupModal />
                </Row>
                {showGroupList && <DetailGroupList />}
              </Stack>
            }
            refreshTrigger={null}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ScrollableWindow
            scrollableContent={children}
            refreshTrigger={null}
          />
        </Box>
      </RowButColumsAtSm>
    )
  }
)
