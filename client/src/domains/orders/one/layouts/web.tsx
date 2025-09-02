import Grid from '@mui/joy/Grid'
import { WebOnly } from 'components/utilities/conditional-display'
import { OrderLeftPanel, OrderRightPanel } from '../high-level-blocks'
import { InputPositionModal } from '../positions/input.modal'

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
