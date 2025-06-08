import { routeMap } from 'lib/routes'
import { RouteConfig } from 'types/global'
import { AddDetail, UpdateDetail } from './detail/detail'
import { DetailsListPage } from './detail/detail-list'
import { AddMaterial, UpdateMaterial } from './material/material'
import { MaterialsListPage } from './material/material-list'
import { MetalFlowSubSystem } from './spa'
import { AddSuply, ListSupplies } from './supply/components'
import { AddWriteOff, ListWriteoffs } from './writeoff/components'

const { metalflow } = routeMap

const innerRoutes = [
  {
    element: <MetalFlowSubSystem />,
    path: metalflow.index
  },
  {
    element: <MaterialsListPage />,
    path: metalflow.materials
  },
  {
    element: <AddMaterial />,
    path: metalflow.material.new
  },
  {
    element: <UpdateMaterial />,
    path: metalflow.material.edit
  },
  {
    element: <AddSuply />,
    path: metalflow.supply.new
  },
  {
    element: <AddWriteOff />,
    path: metalflow.writeoff.new
  },
  {
    element: <DetailsListPage />,
    path: metalflow.details
  },
  {
    element: <AddDetail />,
    path: metalflow.detail.new
  },
  {
    element: <UpdateDetail />,
    path: metalflow.detail.edit
  },
  {
    element: <ListSupplies />,
    path: metalflow.supplies
  },
  {
    element: <ListWriteoffs />,
    path: metalflow.writeoffs
  }
] as RouteConfig[]

export default innerRoutes

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
