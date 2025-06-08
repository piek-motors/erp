import { routeMap } from 'lib/routes'
import { IndexPage } from 'pages/attendance'
import Attendance from 'pages/attendance/main'
import { MentionList } from 'pages/mention/mentions'
import { RouteConfig } from '../src/types/global'
import metalflow from './pages/metal-flow/routes'
import orders from './pages/orders/main'
import order_detail from './pages/orders/one/main'
import reclamations from './pages/orders/reclamation/ui'
import settings from './pages/settings'

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
