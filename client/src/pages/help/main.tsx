import { Box, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { links } from 'src/components/sidebar'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'

function Help() {
  return (
    <Container maxWidth="xs">
      <Stack py={3}>
        {links.map(each => (
          <Link to={each.href} key={each.href}>
            <Box display="flex" gap={2} p={2} justifyContent="left">
              <Box>{each.icon}</Box> <Typography>{each.name}</Typography>
            </Box>
          </Link>
        ))}
      </Stack>
    </Container>
  )
}

export default [{ element: <Help />, path: AppRoutes.help }] as RouteConfig[]
