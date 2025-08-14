import { ExecuteAction, observer, open, routeMap, useNavigate } from 'lib/index'
import { detailStore } from './store'

export const CreateManufacturingOrder = observer(() => {
  const navigate = useNavigate()
  return (
    <ExecuteAction
      stackProps={{ width: 'min-content', whiteSpace: 'nowrap' }}
      buttonLabel="Создать заказ"
      buttonProps={{
        variant: 'soft',
        color: 'neutral'
      }}
      onSubmit={() =>
        detailStore.createManufacturingOrder().then(r => {
          navigate(open(routeMap.metalflow.manufacturing_order.edit, r.id))
        })
      }
    />
  )
})
