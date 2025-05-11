import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { AppRoutes } from 'src/lib/routes'
import { useOrderDetailStore } from 'src/pages/order/state'
import { RouteConfig } from 'src/types/global'
import {
  useGetManagersQuery,
  useGetOrderByPkQuery
} from 'src/types/graphql-shema'
import { PageTitle } from '../../components'
import { InputFiles } from '../../components/input-files'
import { FileService } from '../../services/file.service'
import { bgcolors, MyChip, Row, text } from '../../shortcuts'
import { orderStatus } from '../../utils/orderColorIndication'
import {
  CommentInputViewPort,
  CommentListViewPort
} from './comments/comment.list'
import { DialogAddEditOrderItem } from './dialogs/add-edit-order-item.dialog'
import { Docs } from './docs'
import { OrderActions } from './header'
import { PositionsList } from './position'
import { AboutOrder } from './statement'
import { EditableInfo as EditRightInfoPanel } from './statement/input'

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
        sx={{
          height: {
            xs: 'auto',
            md: '100vh'
          },
          overflow: 'clip'
        }}
      >
        <DialogAddEditOrderItem refetch={refetch} />
        <Grid xs={12} md={6} flexGrow={1}>
          <Stack
            display={'flex'}
            flexGrow={1}
            flexShrink={0}
            gap={4}
            p={p}
            sx={{
              background: bgcolors.lightgrey,
              overflowY: 'scroll',
              height: {
                xs: 'auto',
                md: '100vh'
              }
            }}
          >
            <Box className="no-print">
              <PageTitle title={text.orderDetails} spaceBetween>
                <OrderActions order={order} />
              </PageTitle>
            </Box>

            <Stack gap={p / 2}>
              <Row gap={1}>
                <MyChip
                  if={!!orderStatus(order)}
                  color="primary"
                  text={orderStatus(order) || ''}
                />
                <MyChip
                  if={order.AwaitingDispatch}
                  text={text.orderReadyForDispatch}
                />
                <MyChip
                  color="danger"
                  if={order.NeedAttention === 'true'}
                  text={text.orderRequiresSpectialAttention}
                />
              </Row>

              <Typography level="h4">
                {order.Entity} __ {order.City}
              </Typography>

              {editMode ? (
                <EditRightInfoPanel
                  data={data.erp_Orders[0]}
                  refetch={refetch}
                  users={users.erp_Users}
                />
              ) : (
                <Stack>
                  <AboutOrder data={data.erp_Orders[0]} />
                </Stack>
              )}
            </Stack>

            <Divider />

            <Box>
              <PositionsList
                gap={p}
                data={data.erp_Orders[0].OrderItems}
                refetch={refetch}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid xs={12} md={6} direction={'column'} container>
          <Grid
            gap={p}
            p={p}
            sx={{
              background: bgcolors.blue,
              overflowY: {
                xs: 'scroll'
              },
              height: {
                xs: 'auto',
                md: '100vh'
              }
            }}
          >
            <Docs
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
            <Divider sx={{ my: p }} />
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
