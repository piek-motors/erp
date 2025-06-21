import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { CreateDetailPage } from './detail/detail_create'
import { DetailsListPage } from './detail/detail_list'
import { UpdateDetailPage } from './detail/detail_update'
import { AddMaterialPage, UpdateMaterialPage } from './material/material'
import { MaterialsListPage } from './material/material_list'
import { MetalFlowRootLayout } from './metalflow_root'
import { Narrow } from './shared/basic'
import { AddSupplyPage } from './supply/supply-create'
import { ListSupplies } from './supply/supply-list'
import { UsageInstruction } from './usage-instuction'
import { WriteoffCreatePage } from './writeoff/create_writeoff'
import { WriteoffList } from './writeoff/list_writeoff/ui'

const { metalflow } = routeMap

function wrapEachRoute(route: RouteConfig) {
  return {
    ...route,
    element: <MetalFlowRootLayout>{route.element}</MetalFlowRootLayout>
  }
}

const innerRoutes = [
  {
    element: <UsageInstruction />,
    path: metalflow.index
  },
  {
    element: <MaterialsListPage />,
    path: metalflow.materials
  },
  {
    element: (
      <Narrow>
        <AddMaterialPage />
      </Narrow>
    ),
    path: metalflow.material.new
  },
  {
    element: <UpdateMaterialPage />,
    path: metalflow.material.edit
  },
  {
    element: (
      <Narrow>
        <AddSupplyPage />
      </Narrow>
    ),
    path: metalflow.supply.new
  },
  {
    element: (
      <Narrow>
        <WriteoffCreatePage />
      </Narrow>
    ),
    path: metalflow.writeoff.new
  },
  {
    element: <DetailsListPage />,
    path: metalflow.details
  },
  {
    element: (
      <Narrow>
        <CreateDetailPage />
      </Narrow>
    ),
    path: metalflow.detail.new
  },
  {
    element: (
      <Narrow maxWidth="md">
        <UpdateDetailPage />
      </Narrow>
    ),
    path: metalflow.detail.edit
  },
  {
    element: <ListSupplies />,
    path: metalflow.supplies
  },
  {
    element: <WriteoffList />,
    path: metalflow.writeoffs
  }
] as RouteConfig[]

export default innerRoutes.map(wrapEachRoute)

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
