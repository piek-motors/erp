/** @jsxImportSource @emotion/react */
import Grid from '@mui/joy/Grid'
import { Order, User } from 'domain-model'
import { OrderLeftPanel, OrderRightPanel } from 'pages/orders/one/components'
import { UpdatePositionBtn } from 'pages/orders/one/dialogs/add-edit-order-item.dialog'

interface Props {
  order: Order
  refetch: () => void
  users: User[]
  user: User
}

// Desktop Layout Component
export const DesktopLayout = (props: Props) => {
  const { order, refetch, users, user } = props

  return (
    <div
      className="desktop-only"
      css={{
        '@media print': {
          display: 'none'
        }
      }}
    >
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
        <OrderLeftPanel order={order} refetch={refetch} users={users} />
        <OrderRightPanel order={order} user={user} />
      </Grid>
    </div>
  )
}
