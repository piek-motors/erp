import {
  ActionButton,
  observer,
  openPage,
  routeMap,
  useNavigate
} from 'lib/index'
import { api } from '../detail/api'

export const CreateDetailOrder = observer(
  ({ detailId }: { detailId: number }) => {
    const navigate = useNavigate()

    const handleSubmit = async () =>
      api
        .createManufacturingOrder(detailId)
        .then(r => {
          navigate(openPage(routeMap.pdo.order.edit, r.id))
        })
        .catch(e => {
          if (
            e.data?.code === 'BAD_REQUEST' &&
            e.message.includes('already exists')
          ) {
            const existingOrderId = parseInt(e.message.split('order_id=')[1])
            if (existingOrderId) {
              navigate(openPage(routeMap.pdo.order.edit, existingOrderId))
            }
          }
        })

    return (
      <ActionButton
        label="В производство"
        onClick={handleSubmit}
        props={{
          variant: 'solid',
          color: 'success',
          sx: {
            fontSize: '0.8rem',
            px: 1
          }
        }}
      />
    )
  }
)
