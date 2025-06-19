import { routeMap } from 'lib/routes'
import { MentionList } from 'mention/mentions'
import { IndexPage } from './attendance'
import Attendance from './attendance/main'
import { RouteConfig } from './lib/types/global'
import metalflow from './metalflow/routes'
import orders from './orders/main'
import order_detail from './orders/one/main'
import reclamations from './orders/reclamation/ui'
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
