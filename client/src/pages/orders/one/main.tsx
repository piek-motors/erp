import { AppRoutes } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { PrintLayout } from 'pages/orders/one/layouts/print'
import { WebLayout } from 'pages/orders/one/layouts/web'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router-dom'
import { LoadingHint } from 'shortcuts'
import { RouteConfig } from 'types/global'
import { CreateOrder } from './create'
import { orderStore } from './stores/order.store'
import { suggestionsStore } from './stores/suggestions.store'

const OrderDetail = observer(() => {
  const queryParams = useParams<{ id: string }>()
  const orderId = parseInt(queryParams.id || '')
  if (!orderId) {
    throw Error('Order id is missing in the url')
  }

  useEffect(() => {
    orderStore.load(orderId)
    suggestionsStore.init()
  }, [])

  const { getRootProps } = useDropzone({
    onDrop: files => orderStore.attachments.onDrop(files, orderId),
    noKeyboard: true,
    noClick: true
  })

  if (!orderStore.order) {
    return <LoadingHint show={true} />
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
    path: AppRoutes.order_detail
  },
  {
    element: <CreateOrder />,
    path: AppRoutes.new_order
  }
] as RouteConfig[]
