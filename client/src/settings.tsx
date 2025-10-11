/** @jsxImportSource @emotion/react */
import { Box, Button } from '@mui/joy'
import { FactoryPage } from 'components/factory_page'
import { useAppContext } from 'hooks'
import { P } from 'lib/index'
import { routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { useNavigate } from 'react-router'

function Settings() {
  const { store } = useAppContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await store.logout()
    navigate('/login')
  }

  return (
    <FactoryPage title="Аккаунт">
      <P>{store.user?.fullName}</P>
      <P>Роль: {store.user?.role}</P>
      <Box>
        <Button
          onClick={handleLogout}
          sx={{ mt: '10px' }}
          color="danger"
          variant="soft"
        >
          Выйти
        </Button>
      </Box>
    </FactoryPage>
  )
}

export default [
  {
    element: <Settings />,
    path: routeMap.settings
  }
] as RouteConfig[]
