import { MetalFlowSys } from 'lib/routes'
import { Observer } from 'mobx-react-lite'
import { RouteConfig } from 'types/global'
import { DetailAddForm, DetailsList, DetailUpdateForm } from './detail/detail'
import { AddMaterial, MaterialsList, UpdateMaterial } from './material/material'
import { MetalFlowSubsystem } from './spa'
import { materialListStore, materialStore } from './stores'
import { AddSuply, SuppliesList } from './supply/components'
import { AddWriteOff, WriteoffsList } from './writeoff/components'

const routes = [
  {
    element: <MetalFlowSubsystem />,
    path: MetalFlowSys.root
  },
  {
    element: <MaterialsList store={materialListStore} />,
    path: MetalFlowSys.materials
  },
  {
    element: <AddMaterial store={materialStore} />,
    path: MetalFlowSys.material_add
  },
  {
    element: <UpdateMaterial store={materialStore} />,
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

export function getComponentByCurrentPath(path: string) {
  return (
    <Observer
      render={() => {
        const component = routes.find(r => r.path === path)?.element || <></>
        return component
      }}
    />
  )
}
