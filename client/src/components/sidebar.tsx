/** @jsxImportSource @emotion/react */
import {
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilSetting,
  UilSortAmountDown,
  UilWrench
} from '@iconscout/react-unicons'
import { IconButton, Stack, Tooltip } from '@mui/joy'
import { NavLink } from 'react-router-dom'
import { AppRoutes, MetalFlowSys } from 'src/lib/routes'

export const links = [
  {
    href: AppRoutes.orders_production,
    icon: <UilSortAmountDown />,
    name: 'Очередность выполнения'
  },
  { href: AppRoutes.reclamation, icon: <UilWrench />, name: 'Рекламации' },
  {
    href: AppRoutes.attendance,
    icon: <UilConstructor />,
    name: 'Рабочее время'
  },
  {
    href: MetalFlowSys.root,
    icon: <UilCalculatorAlt />,
    name: 'Планово диспетческий отдел'
  },
  {
    href: AppRoutes.mentions,
    icon: <UilBell />,
    name: 'Упоминания'
  },
  {
    href: AppRoutes.settings,
    icon: <UilSetting />,
    name: 'Настройки'
  }
]

export function Sidebar() {
  return (
    <Stack
      sx={{
        display: {
          xs: 'none',
          sm: 'flex'
        }
      }}
    >
      {links.map(each => {
        return (
          <NavLink key={each.href} to={each.href} style={{ color: 'inherit' }}>
            <IconButton size="lg" variant="plain">
              <Tooltip title={each.name} placement="right">
                {each.icon}
              </Tooltip>
            </IconButton>
          </NavLink>
        )
      })}
    </Stack>
  )
}
