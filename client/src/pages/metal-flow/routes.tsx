import { Box } from '@mui/joy'
import { routeMap } from 'lib/routes'
import { RouteConfig } from 'types/global'
import { AddDetail, UpdateDetail } from './detail/detail'
import { DetailsListPage } from './detail/detail-list'
import { AddMaterialPage, UpdateMaterialPage } from './material/material'
import { MaterialsListPage } from './material/material-list'
import { Narrow } from './shared/basic'
import { MetalFlowLayout } from './spa'
import { AddSuply, ListSupplies } from './supply/components'
import { AddWriteOff, ListWriteoffs } from './writeoff/components'

const { metalflow } = routeMap

function wrapEachRoute(route: RouteConfig) {
  return {
    ...route,
    element: <MetalFlowLayout>{route.element}</MetalFlowLayout>
  }
}

const innerRoutes = [
  {
    element: <Box p={1}>(*_*)</Box>,
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
    element: (
      <Narrow>
        <UpdateMaterialPage />
      </Narrow>
    ),
    path: metalflow.material.edit
  },
  {
    element: (
      <Narrow>
        <AddSuply />
      </Narrow>
    ),
    path: metalflow.supply.new
  },
  {
    element: (
      <Narrow>
        <AddWriteOff />
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
        <AddDetail />
      </Narrow>
    ),
    path: metalflow.detail.new
  },
  {
    element: (
      <Narrow>
        <UpdateDetail />
      </Narrow>
    ),
    path: metalflow.detail.edit
  },
  {
    element: <ListSupplies />,
    path: metalflow.supplies
  },
  {
    element: <ListWriteoffs />,
    path: metalflow.writeoffs
  }
] as RouteConfig[]

export default innerRoutes.map(wrapEachRoute)

export function getComponentByCurrentPath(path: string) {
  return innerRoutes.find(r => r.path === path)?.element || <></>
}
