/** @jsxImportSource @emotion/react */
import {
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilListOl,
  UilSetting,
  UilWrench
} from '@iconscout/react-unicons'
import { IconButton, Stack, Tooltip } from '@mui/joy'
import { NavLink } from 'react-router-dom'
import { AppRoutes, MetalFlowSys } from 'src/lib/routes'

export const links = [
  {
    href: AppRoutes.orders,
    icon: UilListOl,
    name: 'Очередность выполнения'
  },
  { href: AppRoutes.reclamation, icon: UilWrench, name: 'Рекламации' },
  {
    href: MetalFlowSys.root,
    icon: UilCalculatorAlt,
    name: 'Материаловедение'
  },
  {
    href: AppRoutes.attendance,
    icon: UilConstructor,
    name: 'Рабочее время'
  },
  {
    href: AppRoutes.mentions,
    icon: UilBell,
    name: 'Упоминания'
  },
  {
    href: AppRoutes.settings,
    icon: UilSetting,
    name: 'Настройки'
  }
]

export function Sidebar() {
  return (
    <Stack
      sx={{
        p: 1,
        gap: 1,
        display: {
          xs: 'none',
          sm: 'flex'
        }
      }}
    >
      {links.map(each => {
        return (
          <Tooltip title={each.name} placement="right">
            <NavLink
              key={each.href}
              to={each.href}
              style={{ color: 'inherit' }}
            >
              <IconButton size="lg" variant="plain">
                <Tooltip title={each.name} placement="right">
                  <each.icon width={20} height={20} />
                </Tooltip>
              </IconButton>
            </NavLink>
          </Tooltip>
        )
      })}
    </Stack>
  )
}
