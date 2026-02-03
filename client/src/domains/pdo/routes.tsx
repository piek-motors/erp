import { routeMap } from 'lib/routes'
import type { RouteConfig } from 'lib/types/global'
import { DetailPage } from './detail/detail'
import { CreateDetailPage } from './detail/detail_create'
import { DetailsListPage } from './detail/list/list'
import { DetailGroupById, DetailGroupListPage } from './detail_grouping/main'
import { CreateMaterialPage } from './material/create'
import { MaterialListPage } from './material/list/list'
import { MaterialUpdatePage } from './material/update'
import { ManufacturingList } from './orders/list/list'
import { OrderUpdatePage } from './orders/order'
import { MetalFlowRootLayout, MobilePadding } from './root_layout'
import { OperationsPage } from './warehouse/list'

const { pdo: metalflow } = routeMap

function wrapEachRoute(route: RouteConfig) {
  return {
    ...route,
    element: <MetalFlowRootLayout>{route.element}</MetalFlowRootLayout>,
  }
}

const innerRoutes = [
  {
    element: <ManufacturingList />,
    path: metalflow.index,
  },
  {
    element: <MaterialListPage />,
    path: metalflow.materials,
  },
  {
    element: <CreateMaterialPage />,
    path: metalflow.material.new,
  },
  {
    element: (
      <MobilePadding desktop_too>
        <MaterialUpdatePage />
      </MobilePadding>
    ),
    path: metalflow.material.edit,
  },

  {
    element: <DetailsListPage />,
    path: metalflow.details,
  },
  {
    element: <CreateDetailPage />,
    path: metalflow.detail.new,
  },
  {
    element: (
      <MobilePadding desktop_too>
        <DetailPage />
      </MobilePadding>
    ),
    path: metalflow.detail.edit,
  },
  {
    element: <DetailGroupListPage />,
    path: metalflow.detailGroups,
  },
  {
    element: <DetailGroupById />,
    path: metalflow.detailGroup,
  },
  {
    element: <OperationsPage />,
    path: metalflow.operations,
  },
  {
    element: (
      <MobilePadding desktop_too>
        <OrderUpdatePage />
      </MobilePadding>
    ),
    path: metalflow.order.edit,
  },
] as RouteConfig[]

export default innerRoutes.map(wrapEachRoute)

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
