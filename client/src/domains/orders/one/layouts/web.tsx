import { FactoryPage } from '@/components/factory_page'
import { DoubleScrollWindow } from '@/components/utilities'
import { WebOnly } from '@/components/utilities/conditional-display'
import { OrderActions } from '../header'
import { OrderLeftPanel, OrderRightPanel } from '../high-level-blocks'
import { InputPositionModal } from '../positions/input.modal'

export const WebLayout = () => (
  <WebOnly display="block">
    <DoubleScrollWindow
      firstFlexGrow={2}
      first={
        <FactoryPage title={'Детали заказа'} header={<OrderActions />}>
          <InputPositionModal />
          <OrderLeftPanel />
        </FactoryPage>
      }
      second={<OrderRightPanel />}
    />
  </WebOnly>
)
