import { MentionList } from '@/domains/mentions'
import orders from '@/domains/orders/main'
import order_detail from '@/domains/orders/one/main'
import reclamations from '@/domains/orders/reclamation/ui'
import metalflow from '@/domains/pdo/routes'
import { routeMap } from '@/lib/routes'
import Attendance from './domains/hr/attendance/main'
import type { RouteConfig } from './lib/types/global'
import { IndexPage } from './nav_menu.page'

export const protectedRoutes: RouteConfig[] = [
  ...orders,
  ...Attendance,
  ...order_detail,
  ...reclamations,
  ...metalflow,
  {
    element: <MentionList />,
    path: routeMap.mentions,
  },
  { element: <IndexPage />, path: routeMap.index },
]
