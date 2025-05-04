import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
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
import { InputFiles } from '../../components/input-files'
import { FileService } from '../../services/file.service'
import { bgcolors } from '../../shortcuts'
import { emitNotification } from '../../utils/notification'
import { orderStatus } from '../../utils/orderColorIndication'
import {
  CommentInputViewPort,
  CommentListViewPort
} from './comments/comment.list'
import { DialogAddEditOrderItem } from './dialogs/add-edit-order-item.dialog'
import { DocList } from './docs'
import { OrderActions } from './header'
import { PositionsList } from './position'
import { AboutOrder } from './right-panel'
import { EditableInfo as EditRightInfoPanel } from './right-panel/input'

function OrderDetail() {
  const { store } = useAppContext()
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
    emitNotification('success', 'Загрузка файлов завершена')
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
  const order = data.erp_Orders[0]
  const p = 5

  if (!data?.erp_Orders || !users?.erp_Users) return <>No data</>

  return (
    <section {...getRootProps()} id="dropzone">
      <Grid
        container
        direction={'row'}
        sx={{ height: '100vh', overflow: 'clip' }}
      >
        <DialogAddEditOrderItem refetch={refetch} />
        <Grid xs={6} flexGrow={1}>
          <Stack
            display={'flex'}
            flexGrow={1}
            flexShrink={0}
            p={p}
            sx={{ background: bgcolors.red, height: '100%' }}
          >
            <PageTitle title={`Детали заказа`} />
            <Stack gap={p} p={p} width={'min-content'}>
              <Typography level="h4">
                {order.Entity} __ {order.City}
                {orderStatus(order) ? <span>{orderStatus(order)}</span> : null}
              </Typography>

              <OrderActions order={order} />
              {editMode ? (
                <EditRightInfoPanel
                  data={data.erp_Orders[0]}
                  refetch={refetch}
                  users={users.erp_Users}
                />
              ) : (
                <Stack gap={p / 4}>
                  <AboutOrder data={data.erp_Orders[0]} />
                </Stack>
              )}
            </Stack>

            <Divider />

            <Box p={p}>
              <PositionsList
                gap={p}
                data={data.erp_Orders[0].OrderItems}
                refetch={refetch}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid xs={6} direction={'column'} container>
          <Grid
            p={p}
            sx={{
              background: bgcolors.blue,
              overflowY: 'scroll',
              height: '100vh'
            }}
          >
            <DocList
              data={data.erp_Orders[0].Docs}
              onUpload={onUploadFiles}
              refetch={refetch}
            />
            <InputFiles
              variant="soft"
              upload={files => {
                handleFileOnDrop([...files])
              }}
            />
            <CommentListViewPort user={store.user} />
            <CommentInputViewPort user={store.user} />
          </Grid>
        </Grid>
      </Grid>
    </section>
  )
}

export default [
  {
    element: <OrderDetail />,
    path: AppRoutes.order_detail
  }
] as RouteConfig[]
