import { observer, useEffect } from 'lib/index'
import { DetailGroupsLayout } from './detail-groups-layout'
import { DetailGroupManager } from './detail_list'
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
    <DetailGroupsLayout>
      <DetailGroupManager />
    </DetailGroupsLayout>
  )
})
