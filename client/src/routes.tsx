import help from 'pages/attendance/help'
import Attendance from 'pages/attendance/main'
import { RouteConfig } from '../src/types/global'
import { AppRoutes } from './lib/routes'
import { MentionList } from './pages/mentions'
import metalflow from './pages/metal-flow/routes'
import order_detail from './pages/orders/one/main'
import Orders from './pages/orders/main'
import reclamations from './pages/reclamation'
import settings from './pages/settings'

export const protectedRoutes: RouteConfig[] = [
  ...Orders,
  {
    element: <MentionList />,
    path: AppRoutes.mentions
  },
  ...Attendance,
  ...order_detail,
  ...reclamations,
  ...settings,
  ...metalflow,
  ...help
]
