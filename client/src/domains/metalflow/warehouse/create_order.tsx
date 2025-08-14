import { ExecuteAction, observer, open, routeMap, useNavigate } from 'lib/index'
import { api } from '../detail/api'

export const CreateDetailOrder = observer(() => {
  const navigate = useNavigate()
  return (
    <ExecuteAction
      stackProps={{ width: 'min-content' }}
      buttonLabel="Запуск в производство"
      buttonProps={{
        variant: 'soft'
      }}
      onSubmit={() =>
        api.createManufacturingOrder().then(r => {
          navigate(open(routeMap.metalflow.manufacturing_order.edit, r.id))
        })
      }
    />
  )
})
