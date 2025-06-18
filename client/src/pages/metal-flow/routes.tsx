import { routeMap } from 'lib/routes'
import { RouteConfig } from 'types/global'
import { DetailsListPage } from './detail/detail-list'
import { CreateDetailPage } from './detail/detail.create'
import { UpdateDetailPage } from './detail/detail.update'
import { AddMaterialPage, UpdateMaterialPage } from './material/material'
import { MaterialsListPage } from './material/material-list'
import { Narrow } from './shared/basic'
import { MetalFlowLayout } from './spa'
import { AddSupplyPage } from './supply/supply-create'
import { ListSupplies } from './supply/supply-list'
import { UsageInstruction } from './usage-instuction'
import { WriteoffList } from './writeoff/list/ui'
import { WriteoffCreatePage } from './writeoff/writeoff-create'

const { metalflow } = routeMap

function wrapEachRoute(route: RouteConfig) {
  return {
    ...route,
    element: <MetalFlowLayout>{route.element}</MetalFlowLayout>
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
      <Narrow>
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
