import { routeMap } from 'lib/routes'
import { LoadingHint } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { PrintLayout } from 'pages/orders/one/layouts/print'
import { WebLayout } from 'pages/orders/one/layouts/web'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router-dom'
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
    orderStore.openOrder(orderId)
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
    path: routeMap.order.view
  },
  {
    element: <CreateOrder />,
    path: routeMap.order.new
  }
] as RouteConfig[]
