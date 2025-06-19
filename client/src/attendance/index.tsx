/** @jsxImportSource @emotion/react */
import {
  Icon,
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilListOl,
  UilSetting,
  UilWrench
} from '@iconscout/react-unicons'
import { Badge, Container, IconButton, Stack } from '@mui/joy'
import { Context } from 'index'
import { P, Row, UseIcon } from 'lib/index'
import { routeMap } from 'lib/routes'
import { useCountUnresolvedNotificationsQuery } from 'lib/types/graphql-shema'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

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

export function IndexPage() {
  const { store } = useContext(Context)
  if (!store?.user?.id) {
    throw Error('user not found')
  }

  const { data } = useCountUnresolvedNotificationsQuery({
    variables: {
      userId: store?.user?.id
    },
    refetchWritePolicy: 'overwrite',
    fetchPolicy: 'network-only'
  })

  return (
    <Container maxWidth="xs">
      <Stack py={3} gap={2}>
        {links.map((each, idx) => {
          if (each.name === 'Упоминания') {
            return (
              <BadgeWrapper
                content={
                  data?.orders_notifications_aggregate?.aggregate?.count ?? 1
                }
              >
                <Element
                  key={idx}
                  {...each}
                  count={data?.orders_notifications_aggregate?.aggregate?.count}
                />
              </BadgeWrapper>
            )
          }

          return <Element key={idx} {...each} />
        })}
      </Stack>
    </Container>
  )
}

function Element(props: {
  href: string
  icon: Icon
  name: string
  count?: number
}) {
  const navigate = useNavigate()

  return (
    <Stack sx={{ alignSelf: 'flex-start' }}>
      <IconButton
        variant="plain"
        color="neutral"
        onClick={() => navigate(props.href)}
      >
        <Row gap={2}>
          <UseIcon icon={props.icon} />
          <P>{props.name}</P>
        </Row>
      </IconButton>
    </Stack>
  )
}

function BadgeWrapper(props: { children: React.ReactNode; content: number }) {
  return (
    <Badge
      color="danger"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      badgeContent={props.content}
    >
      {props.children}
    </Badge>
  )
}
