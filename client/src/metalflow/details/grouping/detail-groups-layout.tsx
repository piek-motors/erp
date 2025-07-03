import { ScrollableWindow } from 'components/inputs'
import { Box, observer, P, Row, Stack } from 'lib/index'
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
      <Row sx={{ height: '100%' }}>
        <Box sx={{ minWidth: '300px', height: '100%' }}>
          <ScrollableWindow
            scrollableContent={
              <>
                <Stack p={2} gap={1}>
                  <Row justifyContent="space-between">
                    <P level="title-md">Группы</P>
                    <CreateGroupModal />
                  </Row>
                  {showGroupList && <DetailGroupList />}
                </Stack>
              </>
            }
            refreshTrigger={null}
          />
        </Box>
        <Box sx={{ flex: 1, height: '100%' }}>
          <ScrollableWindow
            scrollableContent={children}
            refreshTrigger={null}
          />
        </Box>
      </Row>
    )
  }
)
