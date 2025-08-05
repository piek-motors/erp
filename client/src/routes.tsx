import { MentionList } from 'domains/mention/mentions'
import metalflow from 'domains/metalflow/routes'
import orders from 'domains/orders/main'
import order_detail from 'domains/orders/one/main'
import reclamations from 'domains/orders/reclamation/ui'
import { routeMap } from 'lib/routes'
import Attendance from './domains/attendance/main'
import { IndexPage } from './index.page'
import { RouteConfig } from './lib/types/global'
import settings from './settings'

export const protectedRoutes: RouteConfig[] = [
  ...orders,
  ...Attendance,
  ...order_detail,
  ...reclamations,
  ...settings,
  ...metalflow,
  {
    element: <MentionList />,
    path: routeMap.mentions
  },
  { element: <IndexPage />, path: routeMap.index }
]
