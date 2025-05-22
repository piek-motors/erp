/** @jsxImportSource @emotion/react */
import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { PageTitle } from 'components'
import { InputFiles } from 'components/input-files'
import { useAppContext } from 'hooks'
import { AppRoutes } from 'lib/routes'
import { Observer } from 'mobx-react-lite'
import { useOrderDetailStore } from 'pages/orders/one/state'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import { FileService } from 'services/file.service'
import { bgcolors, MyChip, Row, text } from 'shortcuts'
import { RouteConfig } from 'types/global'
import { useGetManagersQuery, useGetOrderByPkQuery } from 'types/graphql-shema'
import { orderStatus } from 'utils/orderColorIndication'
import {
  CommentInputViewPort,
  CommentListViewPort
} from './comments/comment.list'
import { UpdatePositionBtn } from './dialogs/add-edit-order-item.dialog'
import { Docs } from './docs'
import { OrderActions } from './header'
import { orderStore } from './order.store'
import { Paymnets } from './payments'
import { PositionsList } from './position'
import { orderInfoPrintStyle, orderPositionsStyle } from './prints.styles'
import { StatementInput as EditRightInfoPanel } from './statement/input'
import { AboutOrder } from './statement/statement'

// Header component showing order page title and actions
const PageHeader = ({ order }) => (
  <Box className="no-print">
    <PageTitle title={text.orderDetails} spaceBetween>
      <OrderActions order={order} />
    </PageTitle>
  </Box>
)

// Order metadata component showing entity, city and status chips
const OrderMetadata = ({ order }) => (
  <Row gap={1}>
    <Typography level="h4">
      {order.Entity} __ {order.City}
    </Typography>
    <MyChip
      if={!!orderStatus(order)}
      color="primary"
      text={orderStatus(order) || ''}
    />
    <MyChip if={order.AwaitingDispatch} text={text.orderReadyForDispatch} />
    <MyChip
      color="danger"
      if={order.NeedAttention === 'true'}
      text={text.orderRequiresSpectialAttention}
    />
  </Row>
)

// Component for positions list section
const OrderPositionsSection = ({ order, refetch, gap }) => (
  <Box>
    <PositionsList gap={gap} data={order.OrderItems} refetch={refetch} />
  </Box>
)

// Component for the order info section
const OrderInfoSection = ({ order, refetch, users }) => (
  <Observer
    render={() => (
      <Box>
        {orderStore.editMode ? (
          <EditRightInfoPanel data={order} refetch={refetch} users={users} />
        ) : (
          <Stack css={orderInfoPrintStyle}>
            <AboutOrder data={order} />
          </Stack>
        )}
        <Paymnets data={order} />
      </Box>
    )}
  />
)

// Component for the documents section
const OrderDocsSection = ({
  order,
  onUploadFiles,
  refetch,
  handleFileOnDrop
}) => (
  <>
    <Docs data={order.Docs} onUpload={onUploadFiles} refetch={refetch} />
    <InputFiles
      size="sm"
      variant="outlined"
      sx={{ fontSize: '.8rem' }}
      upload={files => {
        handleFileOnDrop([...files])
      }}
    />
  </>
)

// Component for the comments section
const OrderCommentsSection = ({ user }) => (
  <Box className="no-print">
    <Divider sx={{ my: 4 }} />
    <CommentListViewPort user={user} />
    <CommentInputViewPort user={user} />
  </Box>
)

// Left panel with positions and order info
const OrderLeftPanel = ({ order, refetch, users, p }) => (
  <Grid
    xs={12}
    md={7}
    flexGrow={1}
    css={orderPositionsStyle}
    sx={{
      p: 2,
      overflowY: 'scroll',
      height: {
        xs: 'auto',
        md: '100vh'
      }
    }}
  >
    <Stack display={'flex'} flexGrow={1} flexShrink={0} gap={4}>
      <PageHeader order={order} />
      <OrderMetadata order={order} />
      <OrderPositionsSection order={order} refetch={refetch} gap={p} />
      <Divider />
      <OrderInfoSection order={order} refetch={refetch} users={users} />
    </Stack>
  </Grid>
)

// Right panel with docs and comments
const OrderRightPanel = ({
  order,
  onUploadFiles,
  refetch,
  handleFileOnDrop,
  user,
  p
}) => (
  <Grid xs={12} md={5} direction={'column'} container>
    <Grid
      gap={p}
      sx={{
        p: 2,
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
      <OrderDocsSection
        order={order}
        onUploadFiles={onUploadFiles}
        refetch={refetch}
        handleFileOnDrop={handleFileOnDrop}
      />
      <OrderCommentsSection user={user} />
    </Grid>
  </Grid>
)

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
  const p = 4

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
        <UpdatePositionBtn refetch={refetch} />
        <OrderLeftPanel
          order={order}
          refetch={refetch}
          users={users.erp_Users}
          p={p}
        />
        <OrderRightPanel
          order={order}
          onUploadFiles={onUploadFiles}
          refetch={refetch}
          handleFileOnDrop={handleFileOnDrop}
          user={store.user}
          p={p}
        />
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
