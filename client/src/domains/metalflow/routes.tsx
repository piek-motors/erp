import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { CreateDetailPage } from './detail/create'
import { DetailsListPage } from './detail/list/list'
import { UpdateDetailPage } from './detail/update'
import { DetailGroupById, DetailGroupListPage } from './detail_grouping/main'
import { ManufacturingList } from './manufacturing/list/list'
import { ManufacturingUpdatePage } from './manufacturing/update'
import { MaterialAddPage } from './material/insert'
import { MaterialListPage } from './material/list/list'
import { MaterialUpdatePage } from './material/update'
import { MetalFlowRootLayout } from './metalflow_root'
import { Narrow } from './shared/basic'
import { UsageInstruction } from './usage-instuction'
import { OperationsList } from './warehouse/list'

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
      <Narrow maxWidth="md">
        <CreateDetailPage />
      </Narrow>
    ),
    path: metalflow.detail.new
  },
  {
    element: <UpdateDetailPage />,
    path: metalflow.detail.edit
  },
  {
    element: <DetailGroupListPage />,
    path: metalflow.detailGroups
  },
  {
    element: <DetailGroupById />,
    path: metalflow.detailGroup
  },
  {
    element: <OperationsList />,
    path: metalflow.operations
  },
  {
    element: <ManufacturingList />,
    path: metalflow.manufacturing_orders
  },
  {
    element: (
      <Narrow>
        <ManufacturingUpdatePage />
      </Narrow>
    ),
    path: metalflow.manufacturing_order.edit
  }
] as RouteConfig[]

export default innerRoutes.map(wrapEachRoute)

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
