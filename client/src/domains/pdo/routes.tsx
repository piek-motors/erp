import { routeMap } from '@/lib/routes'
import type { RouteConfig } from '@/lib/types/global'
import { CreateDetailPage, DetailPage } from './detail/detail'
import { DetailsListPage } from './detail/list/list'
import { GroupListPage } from './detail_grouping/main'
import {
  DetailRequestDetailsPage,
  DetailRequestListPage,
} from './detail_requests/list'
import { MaterialListPage } from './material/list/list'
import { CreateMaterialPage, MaterialUpdatePage } from './material/material'
import { ProductionOrderList } from './orders/list/production'
import { OrderUpdatePage } from './orders/order'
import { MetalFlowRootLayout, MobilePadding } from './root_layout'
import { InventoryLogPage } from './warehouse/inventory_log'

const { pdo: metalflow } = routeMap

export default {
  element: <MetalFlowRootLayout />,
  children: [
    {
      element: <ProductionOrderList />,
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
      element: <GroupListPage />,
      path: metalflow.detailGroups,
    },
    {
      element: <GroupListPage />,
      path: metalflow.detailGroup,
    },
    {
      element: <DetailRequestListPage />,
      path: metalflow.detailRequests,
    },
    {
      element: (
        <MobilePadding desktop_too>
          <DetailRequestDetailsPage />
        </MobilePadding>
      ),
      path: metalflow.detailRequest,
    },
    {
      element: <InventoryLogPage />,
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
  ],
} as RouteConfig
