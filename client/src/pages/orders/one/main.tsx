/** @jsxImportSource @emotion/react */
import { useAppContext } from 'hooks'
import { AppRoutes } from 'lib/routes'
import { map } from 'pages/orders/mappers'
import { docsStore } from 'pages/orders/one/docs.store'
import { DesktopLayout } from 'pages/orders/one/layouts/desktop'
import { PrintLayout } from 'pages/orders/one/layouts/print'
import { useOrderDetailStore } from 'pages/orders/one/state'
import { useLayoutEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import { RouteConfig } from 'types/global'
import { useGetManagersQuery, useGetOrderByPkQuery } from 'types/graphql-shema'

function OrderDetail() {
  const { store } = useAppContext()
  const [onUploadFiles, setOnUploadFiles] = useState<File[]>([])
  const defaultEditMode = new URLSearchParams(useLocation().search).get('edit')
    ? true
    : false
  const queryParams = useParams<{ id: string }>()
  const orderId = parseInt(queryParams.id || '')
  if (!orderId) throw Error('Order id is missing in the url')
  const { initialize } = useOrderDetailStore()

  useLayoutEffect(() => {
    initialize(orderId)
  }, [orderId])



  const { data, refetch } = useGetOrderByPkQuery({
    variables: {
      id: orderId
    }
  })

  const { data: users } = useGetManagersQuery()
  const { getRootProps } = useDropzone({
    onDrop: files => docsStore.handleFilesOnDrop(files, orderId),
    noKeyboard: true,
    noClick: true
  })

  if (!data?.orders_orders || !store.user?.id) return null
  const p = 2

  if (!data?.orders_orders || !users?.users) return <>No data</>
  const d_order = map.order.fromDto(data.orders_orders[0])
  const d_users = users?.users?.map(map.user.fromDto)

  return (
    <section {...getRootProps()} id="dropzone">
      {/* Print Layout - Only visible when printing */}
      <PrintLayout order={d_order} refetch={refetch} />

      {/* Desktop Layout - Not shown when printing */}
      <DesktopLayout
        order={d_order}
        refetch={refetch}
        users={d_users}
        user={map.user.fromDto(store.user)}
      />
    </section>
  )
}

export default [
  {
    element: <OrderDetail />,
    path: AppRoutes.order_detail
  }
] as RouteConfig[]
