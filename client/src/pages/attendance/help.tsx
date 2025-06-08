/** @jsxImportSource @emotion/react */
import { Container, IconButton, Stack } from '@mui/joy'
import { routeMap } from 'lib/routes'
import { P, Row, UseIcon } from 'lib/shortcuts'
import { useNavigate } from 'react-router-dom'
import { RouteConfig } from 'types/global'

import {
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilListOl,
  UilSetting,
  UilWrench
} from '@iconscout/react-unicons'

export const links = [
  {
    href: routeMap.orders.priorityList,
    icon: UilListOl,
    name: 'Очередность выполнения'
  },
  { href: routeMap.reclamation, icon: UilWrench, name: 'Рекламации' },
  {
    href: routeMap.metalflow.index,
    icon: UilCalculatorAlt,
    name: 'Материаловедение'
  },
  {
    href: routeMap.attendance,
    icon: UilConstructor,
    name: 'Рабочее время'
  },
  {
    href: routeMap.mentions,
    icon: UilBell,
    name: 'Упоминания'
  },
  {
    href: routeMap.settings,
    icon: UilSetting,
    name: 'Настройки'
  }
]

function Help() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="xs">
      <Stack py={3} gap={2}>
        {links.map((each, idx) => (
          <Stack sx={{ alignSelf: 'flex-start' }} key={idx}>
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => navigate(each.href)}
            >
              <Row gap={2}>
                <UseIcon icon={each.icon} />
                <P>{each.name}</P>
              </Row>
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Container>
  )
}

export default [{ element: <Help />, path: routeMap.index }] as RouteConfig[]
