/** @jsxImportSource @emotion/react */
import { observer, P, Row, UseIcon } from '@/lib/index'
import { routeMap } from '@/lib/routes'
import { rpc } from '@/lib/rpc/rpc.client'
import { authStore } from '@/lib/store/auth.store'
import {
  type Icon,
  UilBell,
  UilCalculatorAlt,
  UilConstructor,
  UilListOl,
  UilWrench,
} from '@iconscout/react-unicons'
import { Badge, Button, IconButton, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const links = [
  {
    href: routeMap.orders.priorityList,
    icon: UilListOl,
    name: 'Заказы & Очередность',
  },
  { href: routeMap.reclamation, icon: UilWrench, name: 'Рекламации' },
  {
    href: routeMap.pdo.index,
    icon: UilCalculatorAlt,
    name: 'ПДО',
  },
  {
    href: routeMap.attendance,
    icon: UilConstructor,
    name: 'Рабочее время',
  },
  {
    href: routeMap.mentions,
    icon: UilBell,
    name: 'Упоминания',
  },
]

export const IndexPage = observer(() => {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (authStore.user?.id) {
      rpc.orders.mentions.count
        .query({
          user_id: authStore.user.id,
        })
        .then(setCount)
    }
  }, [])

  async function handleLogout() {
    await authStore.logout()
    navigate('/login')
  }

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
      <Stack width={300} gap={1}>
        <P level="body-xs">
          Аккаунт: {authStore.user?.email} {authStore.user?.fullName}
          <br />
          Роль: {authStore.user?.roles}
        </P>
        <P level="body-xs" color="neutral">
          Предложения по улучшению можно отправить в телеграме{' '}
          <P fontWeight={700}>invalid_parameter</P> или на почту{' '}
          <P fontWeight={700}>loseev5@gmail.com</P>
        </P>
        <Button
          sx={{ width: 'fit-content' }}
          onClick={handleLogout}
          size="sm"
          color="danger"
          variant="outlined"
        >
          Выйти
        </Button>
      </Stack>
    </Stack>
  )
})

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

const BadgeWrapper = (props: {
  children: React.ReactNode
  content: number
}) => (
  <Badge
    color="danger"
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    badgeContent={props.content}
  >
    {props.children}
  </Badge>
)
