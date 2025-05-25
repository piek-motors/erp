/** @jsxImportSource @emotion/react */
import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { PageTitle } from 'components'
import { InputFiles } from 'components/input-files'
import { User } from 'domain-model'
import { Order } from 'domain-model/dist/domain/orders/order'
import { observer, Observer } from 'mobx-react-lite'
import { docsStore } from 'pages/orders/one/docs.store'
import { bgcolors, Chip, Row, text } from 'shortcuts'
import { orderStatus } from 'utils/orderColorIndication'
import {
  CommentInputViewPort,
  CommentListViewPort
} from './comments/comment.list'
import { Docs } from './docs'
import { OrderActions } from './header'
import { orderStore } from './order.store'
import { Paymnets } from './payments'
import { PositionsList } from './position'
import { orderInfoPrintStyle, orderPositionsStyle } from './prints.styles'
import { StatementInput as EditRightInfoPanel } from './statement/input'
import { AboutOrder } from './statement/statement'

// Header component showing order page title and actions
export const PageHeader = ({ order }: { order: Order }) => (
  <PageTitle title={text.orderDetails} spaceBetween>
    <OrderActions order={order} />
  </PageTitle>
)

// Order metadata component showing entity, city and status chips
export const OrderMetadata = ({ order }: { order: Order }) => (
  <Row gap={1}>
    <Typography level="h4">
      {order.contractor} __ {order.city}
    </Typography>
    <Chip
      chipProps={{
        color: 'primary'
      }}
      if={!!orderStatus(order)}
      text={orderStatus(order) || ''}
    />
    <Chip
      chipProps={{
        color: 'warning'
      }}
      if={order.awatingDispatch ?? false}
      text={text.orderReadyForDispatch}
    />
    <Chip
      chipProps={{
        color: 'danger'
      }}
      if={order.needAttention ?? false}
      text={text.orderRequiresSpectialAttention}
    />
  </Row>
)

// Component for the order info section
export const OrderInfoSection = ({ order, refetch, users }) => (
  <Observer
    render={() => (
      <Box>
        {orderStore.editMode ? (
          <EditRightInfoPanel order={order} refetch={refetch} users={users} />
        ) : (
          <Stack css={orderInfoPrintStyle}>
            <AboutOrder o={order} />
          </Stack>
        )}
        <Paymnets data={order} />
      </Box>
    )}
  />
)

// Component for the documents section
export const OrderDocsSection = observer(({ order }: { order: Order }) => (
  <>
    <Docs orderId={order.id} />
    <InputFiles
      size="sm"
      variant="outlined"
      sx={{ fontSize: '.8rem' }}
      upload={files => {
        docsStore.handleFilesOnDrop(Array.from(files), order.id)
      }}
    />
  </>
))

// Component for the comments section
export const OrderCommentsSection = ({ user }) => (
  <Box>
    <Divider sx={{ my: 4 }} />
    <CommentListViewPort user={user} />
    <CommentInputViewPort user={user} />
  </Box>
)

interface IOrderLeftPanelProps {
  order: Order
  refetch: () => void
  users: User[]
}
// Left panel with positions and order info
export const OrderLeftPanel = ({
  order,
  refetch,
  users
}: IOrderLeftPanelProps) => (
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
      <Box>
        <PositionsList data={order.items} refetch={refetch} />
      </Box>
      <Divider />
      <OrderInfoSection order={order} refetch={refetch} users={users} />
    </Stack>
  </Grid>
)

// Right panel with docs and comments
export const OrderRightPanel = ({
  order,
  user
}: {
  order: Order
  user: User
}) => (
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
      <OrderDocsSection order={order} />
      <OrderCommentsSection user={user} />
    </Grid>
  </Grid>
)
