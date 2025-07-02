import { observer, useEffect } from 'lib/index'
import { useParams } from 'react-router-dom'
import { DetailGroupsLayout } from './detail-groups-layout'
import { DetailGroupManager } from './detail_list'
import { detailGroupStore } from './store'

export const DetailGroupPage = observer(() => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!isNaN(groupId)) {
        detailGroupStore.loadGroupWithDetails(groupId)
        detailGroupStore.loadAvailableDetails()
      }
    }
    return () => {
      detailGroupStore.clear()
    }
  }, [id])

  return (
    <DetailGroupsLayout>
      <DetailGroupManager />
    </DetailGroupsLayout>
  )
})
