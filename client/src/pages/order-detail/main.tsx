import { Sheet } from '@mui/joy'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { AppRoutes } from 'src/lib/routes'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { RouteConfig } from 'src/types/global'
import {
  useGetManagersQuery,
  useGetOrderByPkQuery
} from 'src/types/graphql-shema'
import { PageTitle } from '../../components'
import { FileService } from '../../services/file.service'
import { CommentList } from './comments/comment.list'
import { DialogAddEditOrderItem } from './dialogs/add-edit-order-item.dialog'
import Docs from './docs'
import OrderHeader from './header'
import OrderItemList from './position'
import RightInfoPanel from './right-panel'
import EditRightInfoPanel from './right-panel/input'
import './sass/index.sass'
import { isFileOnDropzone } from './utils.dropzone'

function OrderDetail() {
  const { store } = useAppContext()
  // files that now in uploading
  const [onUploadFiles, setOnUploadFiles] = useState<File[]>([])

  const defaultEditMode = new URLSearchParams(useLocation().search).get('edit')
    ? true
    : false
  const queryParams = useParams<{ id: string }>()
  const orderId = parseInt(queryParams.id || '')

  if (!orderId) throw Error('Null OrderId at the local store')

  const { editMode, initialize } = useOrderDetailStore()

  useLayoutEffect(() => {
    initialize(orderId, defaultEditMode)
  }, [orderId])

  const handleFileOnDrop = useCallback(async (acceptedFiles: File[]) => {
    setOnUploadFiles(acceptedFiles)
    const res = await FileService.uploadFile(acceptedFiles, orderId)
    if (res.status === 200) {
      refetch()
    } else {
      console.log('S3 file upload error', res)
      refetch()
    }
    setOnUploadFiles([])
  }, [])

  const { data, refetch } = useGetOrderByPkQuery({
    variables: {
      OrderID: orderId
    }
  })

  const { data: users } = useGetManagersQuery()

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: handleFileOnDrop,
    noKeyboard: true,
    noClick: true
  })

  if (!data?.erp_Orders || !store.user?.UserID) return null

  return (
    <>
      <PageTitle title="Детали заказа" />
      <Sheet>
        <DialogAddEditOrderItem refetch={refetch} />

        {isFileOnDropzone(isDragActive)}
        {data.erp_Orders && users?.erp_Users ? (
          <>
            <section className="OrderLayout" {...getRootProps()} id="dropzone">
              <div className="LeftSideContent">
                <OrderHeader order={data.erp_Orders[0]} />
                <OrderItemList
                  data={data.erp_Orders[0].OrderItems}
                  refetch={refetch}
                />
                <CommentList user={store.user} />
                <Docs
                  data={data.erp_Orders[0].Docs}
                  onUpload={onUploadFiles}
                  refetch={refetch}
                />
              </div>

              <div className="Info">
                {editMode ? (
                  <EditRightInfoPanel
                    data={data.erp_Orders[0]}
                    refetch={refetch}
                    users={users.erp_Users}
                  />
                ) : (
                  <RightInfoPanel data={data.erp_Orders[0]} />
                )}
              </div>
            </section>
          </>
        ) : null}
      </Sheet>
    </>
  )
}

export default [
  {
    element: <OrderDetail />,
    path: AppRoutes.order_detail
  }
] as RouteConfig[]
