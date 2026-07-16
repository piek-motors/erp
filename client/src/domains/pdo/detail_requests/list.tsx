import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { ScrollableWindow } from '@/components/inputs'
import { useParams } from '@/lib/index'
import { DetailRequestDetails } from './details'
import { DetailRequestListStore } from './list.store'
import { DetailRequestList, DetailRequestListHeader } from './list_content'

export const DetailRequestListPage = observer(() => {
  const [store] = useState(() => new DetailRequestListStore())

  useEffect(() => {
    store.reload()
  }, [])

  return (
    <ScrollableWindow
      static={<DetailRequestListHeader />}
      scroll={<DetailRequestList store={store} />}
    />
  )
})

export const DetailRequestDetailsPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    throw new Error('Invalid page params; id is required')
  }

  const [store] = useState(() => new DetailRequestListStore())
  const requestId = Number(id)
  if (!Number.isFinite(requestId)) {
    throw new Error('Invalid page params; id must be a number')
  }

  useEffect(() => {
    store.setSelectedId(requestId)
  }, [id])

  return <DetailRequestDetails store={store} />
})
