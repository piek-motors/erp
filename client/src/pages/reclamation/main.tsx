import { UilWrench } from '@iconscout/react-unicons'
import { Button } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from 'src/lib/routes'
import { OrderStatus, RouteConfig, TReclamationOrder } from 'src/types/global'
import {
  useGetReclamationOrdersQuery,
  useInsertOrderMutation
} from 'src/types/graphql-shema'
import Reclamation from './reclamation'

function ReclamationContainer() {
  const navigate = useNavigate()

  const [insertOrder] = useInsertOrderMutation({
    variables: {
      orderStatusID: OrderStatus.reclInbox
    }
  })

  async function handleAddOrder() {
    const res = await insertOrder()
    const id = res.data?.insert_erp_Orders?.returning[0].OrderID
    navigate(AppRoutes.order_detail + id + ' ?edit=true')
  }

  const { data, loading } = useGetReclamationOrdersQuery({
    fetchPolicy: 'cache-and-network'
  })

  const filterByStatus = (array: TReclamationOrder[], status: OrderStatus) => {
    if (!array) return []
    return array.filter(each => each.OrderStatusID === status)
  }

  return (
    <>
      <div className="pageLayout__header">
        <UilWrench className="pageLayout__icon" />
        <div className="pageLayout__title">Рекламация</div>

        <div className="pageLayout__actions">
          <Button onClick={handleAddOrder}>Добавить рекламацию</Button>
        </div>
      </div>

      {!loading && (
        <Reclamation
          inbox={filterByStatus(data?.erp_Orders || [], OrderStatus.reclInbox)}
          decision={filterByStatus(
            data?.erp_Orders || [],
            OrderStatus.reclDecision
          )}
          inproduction={filterByStatus(
            data?.erp_Orders || [],
            OrderStatus.reclProduction
          )}
        />
      )}
    </>
  )
}

export default [
  {
    element: <ReclamationContainer />,
    path: AppRoutes.reclamation
  }
] as RouteConfig[]
