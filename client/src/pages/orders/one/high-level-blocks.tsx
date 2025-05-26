/** @jsxImportSource @emotion/react */
import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { PageTitle } from 'components'
import { InputFiles } from 'components/input-files'
import { User } from 'domain-model'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import { Attachments } from 'pages/orders/one/attachments/ui'
import { bgcolors, Chip, Row, text } from 'shortcuts'
import { orderStatus } from 'utils/orderColorIndication'
import { CommentInputViewPort, CommentListViewPort } from './comments/ui'
import { OrderActions } from './header'
import { Paymnets } from './payments/ui'
import { PositionsList } from './positions/ui'
import { orderInfoPrintStyle, orderPositionsStyle } from './prints.styles'
import { OrderStatementInput, StatementView } from './statement/ui'
import { orderStore } from './stores/order.store'

export const PageHeader = () => (
  <PageTitle title={text.orderDetails} spaceBetween>
    <OrderActions />
  </PageTitle>
)

// Order metadata component showing entity, city and status chips
export const OrderMetadata = observer(() => {
  if (!orderStore.order) {
    throw new Error('Order not found')
  }
  return (
    <Row gap={1}>
      <Typography level="h4">
        {orderStore.order?.contractor} __ {orderStore.order?.city}
      </Typography>
      <Chip
        chipProps={{
          color: 'primary'
        }}
        if={!!orderStatus(orderStore.order!)}
        text={orderStatus(orderStore.order!) || ''}
      />
      <Chip
        chipProps={{
          color: 'warning'
        }}
        if={orderStore.order?.awatingDispatch ?? false}
        text={text.orderReadyForDispatch}
      />
      <Chip
        chipProps={{
          color: 'danger'
        }}
        if={orderStore.order?.needAttention ?? false}
        text={text.orderRequiresSpectialAttention}
      />
    </Row>
  )
})

// Component for the order info section
export const OrderInfoSection = observer(() => {
  if (!orderStore.order) {
    throw new Error('Order not found')
  }

  console.log('orderStore.editMode', orderStore)
  return (
    <Box>
      {orderStore.editMode ? (
        <OrderStatementInput
          orderId={orderStore.order.id}
          mutation={() => orderStore.updateOrder(orderStore.order!.id)}
        />
      ) : (
        <Stack css={orderInfoPrintStyle}>
          <StatementView />
        </Stack>
      )}
      <Paymnets order={orderStore.order} />
    </Box>
  )
})

// Component for the documents section
export const OrderDocsSection = observer(() => {
  if (!orderStore.order) {
    throw new Error('Order not found')
  }
  return (
    <>
      <Attachments orderId={orderStore.order.id} />
      <InputFiles
        size="sm"
        variant="outlined"
        sx={{ fontSize: '.8rem' }}
        upload={files => {
          orderStore.attachments.onDrop(Array.from(files), orderStore.order!.id)
        }}
      />
    </>
  )
})

// Component for the comments section
export const OrderCommentsSection = observer(() => {
  const { store } = useAppContext()
  if (!orderStore.order) {
    throw new Error('Order not found')
  }
  const d_user = new User({
    id: store.user?.id,
    firstName: store.user?.first_name ?? '',
    lastName: store.user?.last_name ?? '',
    role: store.user?.role
  })
  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <CommentListViewPort user={d_user} orderId={orderStore.order.id} />
      <CommentInputViewPort user={d_user} orderId={orderStore.order.id} />
    </Box>
  )
})

// Left panel with positions and order info
export const OrderLeftPanel = observer(() => (
  <Grid
    xs={12}
    md={7}
    flexGrow={1}
    css={orderPositionsStyle}
    sx={{
      p: 1,
      overflowY: 'scroll',
      height: {
        xs: 'auto',
        md: '100vh'
      }
    }}
  >
    <Stack display={'flex'} flexGrow={1} flexShrink={0}>
      <PageHeader />
      <Stack p={2} gap={3}>
        <OrderMetadata />
        <Box>
          <PositionsList />
        </Box>
        <Divider />
        <OrderInfoSection />
      </Stack>
    </Stack>
  </Grid>
))

// Right panel with docs and comments
export const OrderRightPanel = observer(() => (
  <Grid xs={12} md={5} direction={'column'} container className="no-print">
    <Grid
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
      <OrderDocsSection />
      <OrderCommentsSection />
    </Grid>
  </Grid>
))
