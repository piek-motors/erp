/** @jsxImportSource @emotion/react */
import { Box, Divider, Stack, Typography } from '@mui/joy'
import Grid from '@mui/joy/Grid'
import { Order } from 'domain-model'
import { Attachments } from 'pages/orders/one/attachments/attachments'
import { PositionsList } from 'pages/orders/one/position'
import { AboutOrder } from 'pages/orders/one/statement/statement'
import { formatOnlyDate } from 'utils/formatting'

// Print Layout Component
export const PrintLayout = ({
  order,
  refetch
}: {
  order: Order
  refetch: () => void
}) => {
  return (
    <Stack gap={1} className="print-only">
      <Box sx={{ mb: 3 }}>
        <Typography level="h3" sx={{ mb: 1 }}>
          {order.contractor} - {order.city}
        </Typography>
        <Typography level="body-md">
          Счет: {order.invoiceNumber || 'N/A'}
        </Typography>
        {order.factoryNumber && (
          <Typography level="body-md">
            Номер заказа: {order.factoryNumber}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <PositionsList data={order.items} refetch={refetch} />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <AboutOrder o={order} />
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
}
