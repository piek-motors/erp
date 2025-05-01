import { MetalFlowSys } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import { DetailAdd } from './detail/detail.add'
import { DetailUpdate } from './detail/detail.update'
import { DetailsList } from './detail/details'
import { AddMaterial } from './material/material.add'
import { UpdateMaterial } from './material/material.update'
import { MaterialsList } from './material/materials'
import { SPA } from './spa'
import { AddSuply } from './supply/supply.add'
import { SuppliesList } from './supply/supply.list'
import { AddWriteOff } from './writeoff/writeoff.add'
import { WriteoffsList } from './writeoff/writeoff.list'

const routes = [
  {
    element: <SPA />,
    path: MetalFlowSys.root
  },
  {
    element: <MaterialsList />,
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
    element: <DetailsList />,
    path: MetalFlowSys.details
  },
  {
    element: <DetailAdd />,
    path: MetalFlowSys.detail_add
  },
  {
    element: <DetailUpdate />,
    path: MetalFlowSys.detail_update
  },
  {
    element: <SuppliesList />,
    path: MetalFlowSys.supplies
  },
  {
    element: <WriteoffsList />,
    path: MetalFlowSys.writeoffs
  }
] as RouteConfig[]

export default routes

export function getComponent(path: string) {
  return routes.find(r => r.path === path)?.element
}
