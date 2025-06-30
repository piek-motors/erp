import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { CreateDetailPage } from './details/detail_create'
import { UpdateDetailPage } from './details/detail_update'
import { DetailsListPage } from './details/list/list'
import { ManufacturingList } from './manufacturing/list'
import { MaterialListPage } from './materials/list/list'
import { MaterialAddPage } from './materials/material_add'
import { MaterialUpdatePage } from './materials/material_update'
import { MetalFlowRootLayout } from './metalflow_root'
import { OperationsList } from './operatiions/operations'
import { Narrow } from './shared/basic'
import { UsageInstruction } from './usage-instuction'

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
    element: <OperationsList />,
    path: metalflow.operations
  },
  {
    element: <ManufacturingList />,
    path: metalflow.manufacturing
  }
] as RouteConfig[]

export default innerRoutes.map(wrapEachRoute)

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
