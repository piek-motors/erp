/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  UilCalculatorAlt,
  UilConstructor,
  UilSetting,
  UilSortAmountDown,
  UilWrench
} from '@iconscout/react-unicons'
import { Box } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { AppRoutes, MetalFlowSys } from 'src/lib/routes'
import NotificationsContainer from './notifications/notifications.container'

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
  }
]

export function Sidebar() {
  const styles = css`
    display: flex;
    flex-direction: column;
    /* padding: 10px 0; */
    width: 50px;
    border-right: var(--border);

    @media print {
      width: 0 !important;
      opacity: 0;
    }

    .link {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0px auto;
      color: var(--lowContrast);
      width: 100%;
      height: 50px;
    }

    .active {
      box-shadow: inset 3px 0px 0px var(--L3) !important ;
      background-color: var(--L2);
      color: var(--accent);
    }
    .marginTopAuto {
      margin-top: auto;
    }
  `

  return (
    <Box
      css={styles}
      sx={{
        // dont show on mobile
        display: {
          xs: 'none',
          sm: 'flex'
        }
      }}
    >
      {links.map(each => {
        return (
          <NavLink
            key={each.href}
            to={each.href}
            className={({ isActive }) => 'link' + (isActive ? ' active' : '')}
          >
            {each.icon}
          </NavLink>
        )
      })}

      {/* bottom links */}
      <div className="link marginTopAuto">{<NotificationsContainer />}</div>

      <NavLink
        to={AppRoutes.settings}
        className={({ isActive }) => 'link' + (isActive ? ' active' : '')}
      >
        <UilSetting />
      </NavLink>
    </Box>
  )
}
