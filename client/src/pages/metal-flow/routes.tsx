import { MetalFlowRoutes } from 'lib/routes'
import { RouteConfig } from 'types/global'
import { AddDetail, ListDetails, UpdateDetail } from './detail/detail'
import { AddMaterial, ListMaterials, UpdateMaterial } from './material/material'
import { MetalFlowSubSystem } from './spa'
import { AddSuply, ListSupplies } from './supply/components'
import { AddWriteOff, ListWriteoffs } from './writeoff/components'

const routes = [
  {
    element: <MetalFlowSubSystem />,
    path: MetalFlowRoutes.root
  },
  {
    element: <ListMaterials />,
    path: MetalFlowRoutes.materials
  },
  {
    element: <AddMaterial />,
    path: MetalFlowRoutes.material_add
  },
  {
    element: <UpdateMaterial />,
    path: MetalFlowRoutes.material_update
  },
  {
    element: <AddSuply />,
    path: MetalFlowRoutes.supply_add
  },
  {
    element: <AddWriteOff />,
    path: MetalFlowRoutes.writeoff_add
  },
  {
    element: <ListDetails />,
    path: MetalFlowRoutes.details
  },
  {
    element: <AddDetail />,
    path: MetalFlowRoutes.detail_add
  },
  {
    element: <UpdateDetail />,
    path: MetalFlowRoutes.detail_update
  },
  {
    element: <ListSupplies />,
    path: MetalFlowRoutes.supplies
  },
  {
    element: <ListWriteoffs />,
    path: MetalFlowRoutes.writeoffs
  }
] as RouteConfig[]

export default routes

export function getComponentByCurrentPath(path: string) {
  return routes.find(r => r.path === path)?.element || <></>
}
