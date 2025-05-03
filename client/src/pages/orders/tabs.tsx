/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppRoutes } from 'src/lib/routes'
import { Btn } from '../../shortcuts'
import { OrderStatus } from '../../types/global'
import { useInsertOrderMutation } from '../../types/graphql-shema'
export interface IOrdersNavigationBarProps {
  children?: ReactNode
}

export function NavTabs(props: IOrdersNavigationBarProps) {
  const navigate = useNavigate()

  const [insertOrderMutation] = useInsertOrderMutation({
    variables: {
      orderStatusID: OrderStatus.ordRegistration
    }
  })

  function insertOrderHandler() {
    insertOrderMutation().then(res => {
      navigate(
        `/orders/${res.data?.insert_erp_Orders?.returning[0].OrderID}?edit=true`
      )
    })
  }

  const styles = css`
    display: flex;
    align-items: center;
    gap: 20px;
    height: 40px;
    align-items: stretch;

    a {
      display: flex;
      align-items: center;
      color: var(--highContrast);
      text-decoration: none;
      padding: 0px 10px;
      font-weight: 500;
    }
    .active {
      background: var(--lowContrast);
      color: var(--textInvert);
    }
    .children {
      margin-left: auto;
    }
  `
  return (
    <div css={styles}>
      <NavLink
        to={AppRoutes.orders_registration}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Предзаказы
      </NavLink>
      <NavLink
        to={AppRoutes.orders_production}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Очередность
      </NavLink>
      <NavLink
        to={AppRoutes.orders_recently}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Недавние
      </NavLink>
      <NavLink
        to={AppRoutes.orders_archive}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Архив
      </NavLink>
      <NavLink
        to={AppRoutes.orders_report}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Отчет
      </NavLink>

      <Box
        className="children"
        sx={{ display: 'flex', gap: 20, alignItems: 'center' }}
      >
        {props.children}
        <Btn onClick={insertOrderHandler}>Добавить заказ</Btn>
      </Box>
    </div>
  )
}
