/** @jsxImportSource @emotion/react */
import { Button, Container } from '@mui/joy'
import { useAppContext } from 'hooks'
import { P } from 'lib/index'
import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { useNavigate } from 'react-router-dom'
import { PageTitle } from './components'

function Settings() {
  const { store } = useAppContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await store.logout()
    navigate('/login')
  }

  return (
    <Container maxWidth="sm">
      <PageTitle title="Аккаунт" />
      <P>{store.user?.fullName}</P>
      <P>Роль: {store.user?.role}</P>
      <P>Email: store.user?.email</P>
      <P level="body-sm">
        Data provider: https://{process.env.REACT_APP_HASURA_ENDPOINT}
      </P>
      <Button onClick={handleLogout} sx={{ mt: '10px' }}>
        Выйти
      </Button>
    </Container>
  )
}

export default [
  {
    element: <Settings />,
    path: routeMap.settings
  }
] as RouteConfig[]
