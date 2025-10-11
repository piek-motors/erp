/** @jsxImportSource @emotion/react */
import { Box, Divider, Sheet, Stack } from '@mui/joy'
import { orderStatus } from 'domains/orders/color_indication'
import { useAppContext } from 'hooks'
import { Chip, P, Row, text } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { CommentInputViewPort, CommentListViewPort } from './comments/ui'
import { OrderAttachmentList } from './order-attachment-list'
import { orderStore } from './order.store'
import { Paymnets } from './payments/ui'
import { PositionsList } from './positions/ui'
import { orderInfoPrintStyle } from './prints.styles'
import { OrderStatementInput, StatementView } from './statement/ui'

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
        if={orderStore.order?.awaiting_dispatch ?? false}
        text={text.orderReadyForDispatch}
      />
      <Chip
        chipProps={{
          color: 'danger'
        }}
        if={!!orderStore.order?.need_attention}
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
        <OrderStatementInput
          mutation={() =>
            orderStore.update().then(() => orderStore.switchEditMode())
          }
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
  <Sheet sx={{ borderRadius: 'sm', p: 2 }}>
    <Stack gap={3}>
      <OrderMetadata />
      <Box>
        <PositionsList />
      </Box>
      <Divider />
      <OrderInfoSection />
    </Stack>
  </Sheet>
))

// Right panel with docs and comments
export const OrderRightPanel = observer(() => (
  <Box p={1}>
    <OrderAttachmentList orderId={orderStore.order!.id} />
    <OrderCommentsSection />
  </Box>
))
