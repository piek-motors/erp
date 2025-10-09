import {
  ExecuteAction,
  observer,
  openPage,
  routeMap,
  useNavigate
} from 'lib/index'
import { api } from '../detail/api'

export const CreateDetailOrder = observer(() => {
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
        api.createManufacturingOrder().then(r => {
          navigate(openPage(routeMap.metalflow.manufacturing_order.edit, r.id))
        })
      }
    />
  )
})
