/** @jsxImportSource @emotion/react */
import { Button, Container } from '@mui/joy'
import { useAppContext } from 'hooks'
import { routeMap } from 'lib/routes'
import { P } from 'lib/shortcuts'
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

  return (
    <Container maxWidth="sm">
      <PageTitle title="Аккаунт" />
      <P>
        {store.user?.first_name} {store.user?.last_name}
      </P>
      <P>Уровень доступа: {(store.user as any).role}</P>
      <P> Email: {(store.user as any).Email}</P>
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
