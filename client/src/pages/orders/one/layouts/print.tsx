import { Box, Divider, Grid, Stack } from '@mui/joy'

import { PrintOnly } from 'components/conditional-display'
import { P } from 'lib/shortcuts'
import { formatOnlyDate } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import { PositionsList } from 'pages/orders/one/positions/ui'
import { StatementView } from 'pages/orders/one/statement/ui'
import { OrderAttachmentList } from '../order-attachment-list'
import { orderStore } from '../stores/order.store'

export const PrintLayout = observer(() => {
  const order = orderStore.order
  if (!order) return <div>Not found</div>
  return (
    <PrintOnly>
      <Stack gap={1}>
        <Box sx={{ mb: 3 }}>
          <P level="h3" sx={{ mb: 1 }}>
            {order.contractor} - {order.city}
          </P>
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
            <OrderAttachmentList orderId={order.id} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 2 }}>
          <P level="body-sm" sx={{ fontStyle: 'italic' }}>
            Распечатано {formatOnlyDate(new Date().toISOString())}
          </P>
        </Box>
      </Stack>
    </PrintOnly>
  )
})
