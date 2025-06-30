import { ScrollableWindow } from 'components/inputs'
import { PageTitle } from 'components/page-title'
import { Box, observer, P, Row, Stack, useEffect } from 'lib/index'
import { CreateGroupModal } from './create-group.modal'
import { DetailGroupList } from './detail-group-list'
import { DetailGroupManager } from './detail-group-manager'
import { detailGroupStore } from './store'

export const DetailGroupsPage = observer(() => {
  useEffect(() => {
    detailGroupStore.loadGroups()
    detailGroupStore.loadAvailableDetails()
    return () => {
      detailGroupStore.clear()
    }
  }, [])

  return (
    <>
      <Row sx={{ height: '100%' }}>
        <Box sx={{ minWidth: '300px', height: '100%' }}>
          <ScrollableWindow
            staticContent={
              <Stack pt={1}>
                <PageTitle subTitle="Логические группы деталей" hideIcon />
              </Stack>
            }
            scrollableContent={
              <>
                <Stack p={2} gap={1}>
                  <Row justifyContent="space-between">
                    <P level="title-md">Логические группы</P>
                    <CreateGroupModal />
                  </Row>
                  <DetailGroupList />
                </Stack>
              </>
            }
            refreshTrigger={null}
          />
        </Box>
        <Box sx={{ flex: 1, height: '100%' }}>
          <ScrollableWindow
            staticContent={
              <P fontWeight={600} color="primary">
                {detailGroupStore.selectedGroup?.group.name}
              </P>
            }
            scrollableContent={<DetailGroupManager />}
            refreshTrigger={null}
          />
        </Box>
      </Row>
    </>
  )
})
