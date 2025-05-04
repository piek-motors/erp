import { Container, IconButton, Stack, Typography } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { links } from 'src/components/sidebar'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import { Row } from '../../shortcuts'

function Help() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="xs">
      <Stack py={3} gap={2}>
        {links.map(each => (
          <Stack sx={{ alignSelf: 'flex-start' }}>
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => navigate(each.href)}
            >
              <Row gap={2}>
                <each.icon width={24} height={24} />
                <Typography>{each.name}</Typography>
              </Row>
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Container>
  )
}

export default [{ element: <Help />, path: AppRoutes.help }] as RouteConfig[]
