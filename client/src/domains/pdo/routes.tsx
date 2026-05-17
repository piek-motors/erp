import { lazy } from 'react'
import { routeMap } from '@/lib/routes'
import type { RouteConfig } from '@/lib/types/global'
import { CreateDetailPage, DetailPage } from './detail/detail'
import { CreateMaterialPage, MaterialUpdatePage } from './material/material'
import { MetalFlowRootLayout, MobilePadding } from './root_layout'

const DetailsListPage = lazy(() => import('./detail/list/list'))
const GroupListPage = lazy(() => import('./detail_grouping/main'))
const OrderUpdatePage = lazy(() => import('./orders/order'))
const OperationsPage = lazy(() => import('./warehouse/list'))
const MaterialListPage = lazy(() => import('./material/list/list'))
const ProductionOrderList = lazy(() => import('./orders/list/production'))

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
  ],
} as RouteConfig
