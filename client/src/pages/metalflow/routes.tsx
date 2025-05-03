import { MetalFlowSys } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import {
  DetailAddForm,
  DetailsList,
  DetailUpdateForm
} from './detail/components'
import {
  AddMaterial,
  MaterialsList,
  UpdateMaterial
} from './material/components'
import { SPA } from './spa'
import { AddSuply, SuppliesList } from './supply/components'
import { AddWriteOff, WriteoffsList } from './writeoff/components'

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
    element: <DetailAddForm />,
    path: MetalFlowSys.detail_add
  },
  {
    element: <DetailUpdateForm />,
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
