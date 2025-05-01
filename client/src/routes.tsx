import help from 'src/pages/help/main'
import metalflow from 'src/pages/metalflow/main'
import Archive from 'src/pages/orders/archive'
import Production from 'src/pages/orders/production'
import RecentOrders from 'src/pages/orders/recently'
import Registration from 'src/pages/orders/registration'
import Report from 'src/pages/orders/report'
import { RouteConfig } from 'src/types/global'
import Attendance from './pages/attendance/main'
import order_detail from './pages/order-detail/main'
import reclamations from './pages/reclamation/main'
import settings from './pages/settings/main'

export const protectedRoutes: RouteConfig[] = [
  ...Production,
  ...Registration,
  ...RecentOrders,
  ...Archive,
  ...Report,
  ...Attendance,
  ...order_detail,
  ...reclamations,
  ...settings,
  ...metalflow,
  ...help
]
