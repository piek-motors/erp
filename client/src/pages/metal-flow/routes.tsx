import { MetalFlowSys } from 'lib/routes'
import { RouteConfig } from 'types/global'
import { AddDetail, ListDetails, UpdateDetail } from './detail/detail'
import { AddMaterial, ListMaterials, UpdateMaterial } from './material/material'
import { MetalFlowSubSystem } from './spa'
import { AddSuply, ListSupplies } from './supply/components'
import { AddWriteOff, ListWriteoffs } from './writeoff/components'

const routes = [
  {
    element: <MetalFlowSubSystem />,
    path: MetalFlowSys.root
  },
  {
    element: <ListMaterials />,
    path: MetalFlowSys.materials
  },
  {
    element: <AddMaterial />,
    path: MetalFlowSys.material_add
  },
  {
    element: <UpdateMaterial />,
    path: MetalFlowSys.material_update
  },
  {
    element: <AddSuply />,
    path: MetalFlowSys.supply_add
  },
  {
    element: <AddWriteOff />,
    path: MetalFlowSys.writeoff_add
  },
  {
    element: <ListDetails />,
    path: MetalFlowSys.details
  },
  {
    element: <AddDetail />,
    path: MetalFlowSys.detail_add
  },
  {
    element: <UpdateDetail />,
    path: MetalFlowSys.detail_update
  },
  {
    element: <ListSupplies />,
    path: MetalFlowSys.supplies
  },
  {
    element: <ListWriteoffs />,
    path: MetalFlowSys.writeoffs
  }
] as RouteConfig[]

export default routes

export function getComponentByCurrentPath(path: string) {
  return routes.find(r => r.path === path)?.element || <></>
}
