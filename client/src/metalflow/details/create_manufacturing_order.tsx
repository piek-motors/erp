import { observer, open, routeMap, SendMutation, useNavigate } from 'lib/index'
import { detailStore } from './detail.store'

export const CreateManufacturingOrder = observer(() => {
  const navigate = useNavigate()
  return (
    <SendMutation
      stackProps={{ width: 'min-content', whiteSpace: 'nowrap' }}
      buttonLabel="Создать заказ"
      buttonProps={{
        variant: 'soft',
        color: 'neutral'
      }}
      onClick={() =>
        detailStore.createManufacturingOrder().then(r => {
          navigate(open(routeMap.metalflow.manufacturing_order.edit, r.id))
        })
      }
    />
  )
})
