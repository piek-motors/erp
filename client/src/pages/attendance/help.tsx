/** @jsxImportSource @emotion/react */
import { Container, IconButton, Stack, Typography } from '@mui/joy'
import { AppRoutes, ListOrdersRoutes } from 'lib/routes'
import { useNavigate } from 'react-router-dom'
import { RouteConfig } from 'types/global'
import { Row, UseIcon } from 'shortcuts'

import {
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilListOl,
  UilSetting,
  UilWrench
} from '@iconscout/react-unicons'
import { MetalFlowRoutes } from 'lib/routes'

export const links = [
  {
    href: ListOrdersRoutes.priority_list,
    icon: UilListOl,
    name: 'Очередность выполнения'
  },
  { href: AppRoutes.reclamation, icon: UilWrench, name: 'Рекламации' },
  {
    href: MetalFlowRoutes.root,
    icon: UilCalculatorAlt,
    name: 'Материаловедение'
  },
  {
    href: AppRoutes.attendance,
    icon: UilConstructor,
    name: 'Рабочее время'
  },
  {
    href: AppRoutes.mentions,
    icon: UilBell,
    name: 'Упоминания'
  },
  {
    href: AppRoutes.settings,
    icon: UilSetting,
    name: 'Настройки'
  }
]

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
                <UseIcon icon={each.icon} />
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
