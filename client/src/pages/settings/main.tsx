/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Typography } from '@mui/joy'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'

function Settings() {
  const { store } = useAppContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await store.logout()
    navigate('/login')
  }

  const GridCard = ({
    title,
    children
  }: {
    title: string
    children: ReactNode
  }) => (
    <Box className="gridCard">
      <Typography level="h4">{title}</Typography>
      {children}
    </Box>
  )

  const styles = css`
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
    row-gap: 20px;

    .gridCard {
      background: var(--L1);
      border-radius: var(--br);
      line-height: 2;
      padding: 10px 20px 20px;
    }

    .theme {
      display: flex;
      align-items: center;
      column-gap: 15px;
    }
  `

  return (
    <div css={styles}>
      <GridCard title="Аккаунт">
        <div>
          {store.user?.FirstName} {store.user?.LastName}
        </div>
        <div> Уровень доступа: {(store.user as any).AccessLevelID}</div>
        <div> Email: {(store.user as any).Email}</div>
        <Button onClick={handleLogout} sx={{ mt: '10px' }}>
          Выйти
        </Button>
      </GridCard>

      <GridCard title="Data Provider">
        <div>https://{process.env.REACT_APP_HASURA_ENDPOINT}</div>
      </GridCard>
    </div>
  )
}

export default [
  {
    element: <Settings />,
    path: AppRoutes.settings
  }
] as RouteConfig[]
