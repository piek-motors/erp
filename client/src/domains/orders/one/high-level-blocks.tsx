/** @jsxImportSource @emotion/react */
import { Box, Divider, Stack } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { NavigationBar } from 'components/navigation_bar'
import { useAppContext } from 'hooks'
import { bgcolors, Chip, P, Row, text } from 'lib/index'
import { orderStatus } from 'lib/utils/orderColorIndication'
import { observer } from 'mobx-react-lite'
import { CommentInputViewPort, CommentListViewPort } from './comments/ui'
import { OrderActions } from './header'
import { OrderAttachmentList } from './order-attachment-list'
import { Paymnets } from './payments/ui'
import { PositionsList } from './positions/ui'
import { orderInfoPrintStyle, orderPositionsStyle } from './prints.styles'
import { OrderStatementInput, StatementView } from './statement/ui'
import { orderStore } from './stores/order.store'

export const PageHeader = () => (
  <NavigationBar t={'Детали заказа'} spaceBetween>
    <OrderActions />
  </NavigationBar>
)

// Order metadata component showing entity, city and status chips
export const OrderMetadata = observer(() => {
  if (!orderStore.order) {
    throw new Error('Order not found')
  }
  return (
    <Row gap={1}>
      <P level="h4">
        {orderStore.statment?.contractor} __ {orderStore.statment?.city}
      </P>
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
  return (
    <Box>
      {orderStore.editMode ? (
        <OrderStatementInput mutation={() => orderStore.update()} />
      ) : (
        <Stack css={orderInfoPrintStyle}>
          <StatementView />
        </Stack>
      )}
      <Paymnets order={orderStore.order} />
    </Box>
  )
})

// Component for the comments section
export const OrderCommentsSection = observer(() => {
  const { store } = useAppContext()
  if (!orderStore.order) {
    throw new Error('Order not found')
  }
  if (!store.user) {
    throw new Error('User not found')
  }

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <CommentListViewPort user={store.user} orderId={orderStore.order.id} />
      <CommentInputViewPort user={store.user} orderId={orderStore.order.id} />
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
      overflowY: 'scroll',
      height: {
        xs: 'auto',
        md: '100vh'
      }
    }}
  >
    <Stack display={'flex'} flexGrow={1} flexShrink={0}>
      <PageHeader />
      <Stack p={1} gap={3}>
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
  <Grid xs={12} md={5} direction={'column'} container>
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
      <OrderAttachmentList orderId={orderStore.order!.id} />
      <OrderCommentsSection />
    </Grid>
  </Grid>
))
