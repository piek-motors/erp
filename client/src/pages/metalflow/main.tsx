import { MetalFlowSys } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import { DetailAdd, DetailsList, DetailUpdate } from './detail/componets'
import { AddMaterial, UpdateMaterial } from './material/list'
import { MaterialsList } from './material/materials'
import { SPA } from './spa'
import { AddSuply, SuppliesList } from './supply/supply.add'
import { AddWriteOff, WriteoffsList } from './writeoff/writeoff.add'

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
