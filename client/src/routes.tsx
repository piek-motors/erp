import help from 'src/pages/attendance/help'
import metalflow from 'src/pages/metalflow/routes'
import { RouteConfig } from 'src/types/global'
import { AppRoutes } from './lib/routes'
import Attendance from './pages/attendance/main'
import { MentionList } from './pages/mentions'
import order_detail from './pages/order-detail/main'
import { Orders } from './pages/orders/main'
import reclamations from './pages/reclamation'
import settings from './pages/settings'

export const protectedRoutes: RouteConfig[] = [
  {
    path: AppRoutes.orders,
    element: <Orders />
  },
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
