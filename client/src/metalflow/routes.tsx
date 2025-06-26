import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { CreateDetailPage } from './details/detail_create'
import { UpdateDetailPage } from './details/detail_update'
import { DetailsListPage } from './details/list/list'
import { DetailSupplyPage } from './details/supply/supply'
import { DetailWriteoffPage } from './details/writeoff/writeoff'
import { MaterialListPage } from './materials/list/list'
import { MaterialAddPage } from './materials/material_add'
import { MaterialUpdatePage } from './materials/material_update'
import { MaterialSupplyPage } from './materials/supply/supply'
import { MaterialWriteoffPage } from './materials/writeoff/writeoff'
import { MetalFlowRootLayout } from './metalflow_root'
import { Narrow } from './shared/basic'
import { SupplyList } from './supplies/list/list'
import { UsageInstruction } from './usage-instuction'
import { WriteoffList } from './writeoffs/list/list'

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
    element: <MaterialListPage />,
    path: metalflow.materials
  },
  {
    element: (
      <Narrow>
        <MaterialAddPage />
      </Narrow>
    ),
    path: metalflow.material.new
  },
  {
    element: <MaterialUpdatePage />,
    path: metalflow.material.edit
  },
  {
    element: (
      <Narrow>
        <MaterialSupplyPage />
      </Narrow>
    ),
    path: metalflow.supply.new
  },
  {
    element: (
      <Narrow>
        <MaterialWriteoffPage />
      </Narrow>
    ),
    path: metalflow.writeoff.new
  },
  {
    element: (
      <Narrow>
        <DetailSupplyPage />
      </Narrow>
    ),
    path: metalflow.supply.new
  },
  {
    element: (
      <Narrow>
        <DetailWriteoffPage />
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
    element: <SupplyList />,
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
