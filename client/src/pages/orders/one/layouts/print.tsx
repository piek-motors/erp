import { Box, Divider, Grid, Stack, Typography } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { Attachments } from 'pages/orders/one/attachments/ui'
import { PositionsList } from 'pages/orders/one/positions/ui'
import { StatementView } from 'pages/orders/one/statement/ui'
import { formatOnlyDate } from 'utils/formatting'
import { orderStore } from '../stores/order.store'

export const PrintLayout = observer(() => {
  const order = orderStore.order
  if (!order) return <div>Not found</div>
  return (
    <Stack gap={1} className="print-only">
      <Box sx={{ mb: 3 }}>
        <Typography level="h3" sx={{ mb: 1 }}>
          {order.contractor} - {order.city}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <PositionsList />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <StatementView />
        </Grid>
        <Grid xs={12} md={6}>
          <Attachments orderId={order.id} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography level="body-sm" sx={{ fontStyle: 'italic' }}>
          Распечатано {formatOnlyDate(new Date().toISOString())}
        </Typography>
      </Box>
    </Stack>
  )
})
