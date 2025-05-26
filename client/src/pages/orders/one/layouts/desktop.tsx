import Grid from '@mui/joy/Grid'
import {
  OrderLeftPanel,
  OrderRightPanel
} from 'pages/orders/one/high-level-blocks'
import { InputPositionModal } from 'pages/orders/one/positions/input.modal'

export const DesktopLayout = () => {
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
        <InputPositionModal />
        <OrderLeftPanel />
        <OrderRightPanel />
      </Grid>
    </div>
  )
}
