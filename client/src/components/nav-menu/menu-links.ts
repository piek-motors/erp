import {
  BuildRounded,
  CalculateRounded,
  EngineeringRounded,
  FormatListNumberedRounded,
  NotificationsRounded,
} from '@mui/icons-material'
import type { Icon } from '@/lib/index'
import { routeMap } from '@/lib/routes'

export interface MenuLink {
  href: string
  icon: Icon
  name: string
  badgeKey?: 'mentions'
}

export const MENU_LINKS: MenuLink[] = [
  {
    href: routeMap.orders.priorityList,
    icon: FormatListNumberedRounded,
    name: 'Заказы & Очередность',
  },
  { href: routeMap.reclamation, icon: BuildRounded, name: 'Рекламации' },
  { href: routeMap.pdo.index, icon: CalculateRounded, name: 'ПДО' },
  {
    href: routeMap.hr.attendance,
    icon: EngineeringRounded,
    name: 'Рабочее время',
  },
  {
    href: routeMap.mentions,
    icon: NotificationsRounded,
    name: 'Упоминания',
    badgeKey: 'mentions',
  },
]

export const SUPPORT_CONTACT = {
  telegram: 'invalid_parameter',
  email: 'loseev5@gmail.com',
}
