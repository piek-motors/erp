/** @jsxImportSource @emotion/react */
import { Box, Button, Container, Typography } from '@mui/joy'
import { useAppContext } from 'hooks'
import { AppRoutes } from 'lib/routes'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouteConfig } from 'types/global'
import { PageTitle } from '../components'

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

  return (
    <Container maxWidth="sm">
      <PageTitle title="Аккаунт" />
      <Typography>
        {store.user?.first_name} {store.user?.last_name}
      </Typography>
      <Typography>
        Уровень доступа: {(store.user as any).AccessLevelID}
      </Typography>
      <Typography> Email: {(store.user as any).Email}</Typography>
      <Typography level="body-sm">
        Data provider: https://{process.env.REACT_APP_HASURA_ENDPOINT}
      </Typography>
      <Button onClick={handleLogout} sx={{ mt: '10px' }}>
        Выйти
      </Button>
    </Container>
  )
}

export default [
  {
    element: <Settings />,
    path: AppRoutes.settings
  }
] as RouteConfig[]
