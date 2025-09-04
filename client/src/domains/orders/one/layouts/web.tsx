import Grid from '@mui/joy/Grid'
import { FactoryPage } from 'components/factory_page'
import { WebOnly } from 'components/utilities/conditional-display'
import {
  OrderLeftPanel,
  OrderRightPanel,
  PageHeader
} from '../high-level-blocks'
import { InputPositionModal } from '../positions/input.modal'

export const WebLayout = () => {
  return (
    <FactoryPage pageTitle={'Детали заказа'} header={<PageHeader />}>
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
    </FactoryPage>
  )
}
