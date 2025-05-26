import help from 'pages/attendance/help'
import Attendance from 'pages/attendance/main'
import { RouteConfig } from '../src/types/global'
import { AppRoutes } from './lib/routes'
import { MentionList } from './pages/mentions'
import metalflow from './pages/metal-flow/routes'
import orders from './pages/orders/main'
import order_detail from './pages/orders/one/main'
import reclamations from './pages/orders/reclamation/ui'
import settings from './pages/settings'

export const protectedRoutes: RouteConfig[] = [
  ...orders,
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
