import Grid from '@mui/joy/Grid'
import { WebOnly } from 'components/conditional-display'
import {
  OrderLeftPanel,
  OrderRightPanel
} from 'pages/orders/one/high-level-blocks'
import { InputPositionModal } from 'pages/orders/one/positions/input.modal'

export const WebLayout = () => {
  return (
    <WebOnly display="block">
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
        <InputPositionModal />
        <OrderLeftPanel />
        <OrderRightPanel />
      </Grid>
    </WebOnly>
  )
}
