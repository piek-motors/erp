import { Loading } from '@/lib/index'
import { routeMap } from '@/lib/routes'
import type { RouteConfig } from '@/lib/types/global'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router'
import { CreateOrder } from './create'
import { PrintLayout } from './layouts/print'
import { WebLayout } from './layouts/web'
import { orderStore } from './order.store'

const OrderDetail = observer(() => {
  const queryParams = useParams<{ id: string }>()
  const orderId = parseInt(queryParams.id || '')
  if (!orderId) {
    throw Error('Order id is missing in the url')
  }

  useEffect(() => {
    orderStore.openOrder(orderId)
  }, [])

  const { getRootProps } = useDropzone({
    onDrop: files => orderStore.attachments.onDrop(files, orderId, 'order'),
    noKeyboard: true,
    noClick: true,
  })

  if (!orderStore.order) {
    return <Loading />
  }

  return (
    <section {...getRootProps()} id="dropzone">
      <PrintLayout />
      <WebLayout />
    </section>
  )
})

export default [
  {
    element: <OrderDetail />,
    path: routeMap.order.view,
  },
  {
    element: <CreateOrder />,
    path: routeMap.order.new,
  },
] as RouteConfig[]
