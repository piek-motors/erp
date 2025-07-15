import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { CreateDetailPage } from './details/add'
import { DetailGroupPage } from './details/grouping/detail-group-page'
import { DetailGroupsPage } from './details/grouping/groups-page'
import { DetailsListPage } from './details/list/list'
import { UpdateDetailPage } from './details/update'
import { ManufacturingList } from './manufacturing/list'
import { MaterialAddPage } from './materials/add'
import { MaterialListPage } from './materials/list/list'
import { MaterialUpdatePage } from './materials/update'
import { MetalFlowRootLayout } from './metalflow_root'
import { OperationsList } from './operations/list'
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
    element: <UpdateDetailPage />,
    path: metalflow.detail.edit
  },
  {
    element: <DetailGroupsPage />,
    path: metalflow.detailGroups
  },
  {
    element: <DetailGroupPage />,
    path: metalflow.detailGroup
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
