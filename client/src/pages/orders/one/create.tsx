import { Box } from '@mui/joy'
import { CenteredContainer } from 'components/centered-container'
import { PageTitle } from 'components/page-title'
import { OrderStatus } from 'domain-model'
import { openOrderDetailPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Row } from 'shortcuts'
import { statementStore } from './statement/store'
import { OrderStatementInput } from './statement/ui'
import { orderStore } from './stores/order.store'
import { suggestionsStore } from './stores/suggestions.store'

export const CreateOrder = observer(() => {
  const navigate = useNavigate()
  const s = useLocation().state as { reclamation?: boolean }

  useEffect(() => {
    statementStore.clear()
    suggestionsStore.init()

    // Set status after clearing if this is a reclamation order
    if (s?.reclamation) {
      statementStore.setStatus(OrderStatus.ReclamationIncoming)
    }
  }, [s?.reclamation])

  async function handleCreateOrder() {
    const res = await orderStore.insertOrder(
      s?.reclamation ? OrderStatus.ReclamationIncoming : OrderStatus.PreOrder
    )
    if (res) {
      navigate(openOrderDetailPage(res))
    }
    return res
  }

  return (
    <CenteredContainer>
      <Box p={1}>
        <Row>
          <PageTitle title={'Новый заказ'} />
        </Row>
        <OrderStatementInput orderId={0} mutation={handleCreateOrder} />
      </Box>
    </CenteredContainer>
  )
})
