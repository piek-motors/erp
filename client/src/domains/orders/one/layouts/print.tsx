import { Box, Grid, Stack } from '@mui/joy'
import { PrintOnly } from 'components/utilities/conditional-display'
import { Label, P } from 'lib/index'
import { formatOnlyDate } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import { OrderAttachmentList } from '../order-attachment-list'
import { orderStore } from '../order.store'
import { PositionsList } from '../positions/ui'
import { StatementView } from '../statement/ui'

export const PrintLayout = observer(() => {
  const order = orderStore.order
  if (!order) return <div>Not found</div>
  return (
    <PrintOnly>
      <Stack gap={1}>
        <Box sx={{ mb: 3 }}>
          <Label>Заказ №{order.id}</Label>
          <P level="h3">
            {order.contractor} - {order.city}
          </P>
        </Box>

        <Box sx={{ mb: 1 }}>
          <PositionsList />
        </Box>

        <Grid container>
          <Grid xs={12} md={8}>
            <StatementView />
          </Grid>
          <Grid xs={12} md={4}>
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
