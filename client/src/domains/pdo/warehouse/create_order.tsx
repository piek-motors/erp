import {
  ExecuteAction,
  observer,
  openPage,
  routeMap,
  useNavigate
} from 'lib/index'
import { api } from '../detail/api'

export const CreateDetailOrder = observer(
  ({ detailId }: { detailId: number }) => {
    const navigate = useNavigate()
    return (
      <ExecuteAction
        width="fit-content"
        buttonLabel="В производство"
        buttonProps={{
          variant: 'solid',
          color: 'success'
        }}
        onSubmit={() =>
          api
            .createManufacturingOrder(detailId)
            .then(r => {
              navigate(openPage(routeMap.pdo.manufacturing_order.edit, r.id))
            })
            .catch(e => {
              if (
                e.data?.code === 'BAD_REQUEST' &&
                e.message.includes('already exists')
              ) {
                const existingOrderId = parseInt(
                  e.message.split('order_id=')[1]
                )
                if (existingOrderId) {
                  navigate(
                    openPage(
                      routeMap.pdo.manufacturing_order.edit,
                      existingOrderId
                    )
                  )
                }
              }
            })
        }
      />
    )
  }
)
