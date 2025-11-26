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
import { Badge, IconButton, Stack } from '@mui/joy'
import { Context } from 'index'
import { P, Row, UseIcon } from 'lib/index'
import { routeMap } from 'lib/routes'
import { rpc } from 'lib/rpc/rpc.client'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const links = [
  {
    href: routeMap.orders.priorityList,
    icon: UilListOl,
    name: 'Заказы & Очередность'
  },
  { href: routeMap.reclamation, icon: UilWrench, name: 'Рекламации' },
  {
    href: routeMap.pdo.index,
    icon: UilCalculatorAlt,
    name: 'ПДО'
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

  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!store?.user?.id) return

    rpc.orders.mentions.count
      .query({
        user_id: store.user.id
      })
      .then(setCount)
  }, [])

  return (
    <Stack py={3} gap={2} p={2}>
      {links.map((each, idx) => {
        if (each.name === 'Упоминания') {
          return (
            <BadgeWrapper content={count}>
              <Element key={idx} {...each} count={count} />
            </BadgeWrapper>
          )
        }

        return <Element key={idx} {...each} />
      })}
    </Stack>
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
