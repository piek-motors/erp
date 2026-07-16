import {
  BuildRounded,
  CalculateRounded,
  DarkModeRounded,
  EngineeringRounded,
  FormatListNumberedRounded,
  LightModeRounded,
  NotificationsRounded,
} from '@mui/icons-material'
import {
  Badge,
  Box,
  Button,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@mui/joy'
import { useColorScheme } from '@mui/joy/styles'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { type Icon, observer, P, Row, UseIcon } from '@/lib/index'
import { routeMap } from '@/lib/routes'
import { rpc } from '@/lib/rpc/rpc.client'
import { authStore } from '@/lib/store/auth.store'

interface MenuLink {
  href: string
  icon: Icon
  name: string
  badgeKey?: 'mentions'
}

interface MenuCardProps {
  icon: Icon
  name: string
  count?: number
  onClick: () => void
}

const MENU_LINKS: MenuLink[] = [
  {
    href: routeMap.orders.priorityList,
    icon: FormatListNumberedRounded,
    name: 'Заказы & Очередность',
  },
  { href: routeMap.reclamation, icon: BuildRounded, name: 'Рекламации' },
  { href: routeMap.pdo.index, icon: CalculateRounded, name: 'ПДО' },
  {
    href: routeMap.hr.attendance,
    icon: EngineeringRounded,
    name: 'Рабочее время',
  },
  {
    href: routeMap.mentions,
    icon: NotificationsRounded,
    name: 'Упоминания',
    badgeKey: 'mentions',
  },
]

const SUPPORT_CONTACT = {
  telegram: 'invalid_parameter',
  email: 'loseev5@gmail.com',
}

function useMentionsCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const userId = authStore.user?.id
    if (!userId) return

    rpc.orders.mentions.count
      .query({ user_id: userId })
      .then(setCount)
      .catch(err => console.error('Failed to fetch mentions count:', err))
  }, [])

  return count
}

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: theme =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #111827 52%, #1f2937 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: theme =>
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at 20% 50%, rgba(80, 100, 140, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(50, 70, 110, 0.24) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(90, 115, 150, 0.16) 0%, transparent 50%)
              `
              : `
                radial-gradient(circle at 20% 50%, rgba(200, 210, 230, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(220, 230, 240, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(210, 220, 235, 0.15) 0%, transparent 50%)
              `,
          animation: 'rotate 40s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              var(--joy-palette-neutral-plainHoverBg) 80px,
              var(--joy-palette-neutral-plainHoverBg) 160px
            )
          `,
        },
        '@keyframes rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      {/* Floating geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          width: 350,
          height: 350,
          border: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          borderRadius: '50%',
          opacity: 0.5,
          top: '8%',
          left: '10%',
          animation: 'float 25s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(40px, -40px) rotate(120deg)' },
            '66%': { transform: 'translate(-30px, 30px) rotate(240deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 250,
          height: 250,
          border: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          borderRadius: '30px',
          opacity: 0.42,
          bottom: '12%',
          right: '12%',
          animation: 'float2 18s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(-50px, -50px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          bgcolor: 'neutral.softBg',
          borderRadius: '50%',
          opacity: 0.45,
          top: '55%',
          left: '75%',
          animation: 'pulse 10s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.03 },
            '50%': { transform: 'scale(1.3)', opacity: 0.06 },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 200,
          height: 200,
          border: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          borderRadius: '50%',
          opacity: 0.38,
          top: '70%',
          left: '5%',
          animation: 'float3 22s ease-in-out infinite',
          '@keyframes float3': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, -30px)' },
          },
        }}
      />
    </Box>
  )
}

const MenuCard = ({ icon, name, count, onClick }: MenuCardProps) => {
  const hasNotification = count !== undefined && count > 0
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        border: '1px solid',
        borderColor: 'neutral.outlinedBorder',
        bgcolor: 'background.popup',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: 'background.surface',
          borderColor: 'neutral.outlinedHoverBorder',
          boxShadow: 'md',
        },
      }}
    >
      <Box sx={{ fontSize: 36, mb: 1.5, color: 'text.secondary' }}>
        <UseIcon icon={icon} />
      </Box>
      <Typography
        level="body-md"
        textAlign="center"
        fontWeight={600}
        sx={{ color: 'text.primary' }}
      >
        {name}
      </Typography>
      {hasNotification && (
        <Badge
          color="danger"
          badgeContent={count}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        />
      )}
    </Box>
  )
}

const ThemeModeSwitch = () => {
  const { mode, systemMode, setMode } = useColorScheme()
  const effectiveMode = mode === 'system' ? systemMode : mode
  const isDark = effectiveMode === 'dark'

  return (
    <Switch
      checked={isDark}
      color={isDark ? 'primary' : 'neutral'}
      startDecorator={<UseIcon icon={LightModeRounded} small />}
      endDecorator={<UseIcon icon={DarkModeRounded} small />}
      slotProps={{
        input: {
          'aria-label': 'Переключить ночную тему',
        },
      }}
      sx={{ alignSelf: 'center' }}
      onChange={event => setMode(event.target.checked ? 'dark' : 'light')}
    />
  )
}

const UserInfo = () => {
  const user = authStore.user
  if (!user) return null
  return (
    <P level="body-xs">
      {user.email} {user.fullName} - {user.roles}
    </P>
  )
}

export const IndexPage = observer(() => {
  const navigate = useNavigate()
  const mentionsCount = useMentionsCount()

  const handleLogout = async () => {
    await authStore.logout()
    navigate('/login')
  }

  const getBadgeCount = (link: MenuLink): number | undefined => {
    if (link.badgeKey === 'mentions') return mentionsCount
    return undefined
  }

  return (
    <>
      <AnimatedBackground />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <P
          color="primary"
          level="h3"
          sx={{
            fontWeight: 700,
            fontFamily: 'monospace',
            fontSize: 28,
            mb: 1,
            letterSpacing: '2px',
          }}
        >
          PIEK ERP
        </P>
        <ThemeModeSwitch />

        {/* Menu grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 2,
            width: '100%',
            maxWidth: 900,
          }}
        >
          {MENU_LINKS.map(link => (
            <MenuCard
              key={link.href}
              icon={link.icon}
              name={link.name}
              count={getBadgeCount(link)}
              onClick={() => navigate(link.href)}
            />
          ))}
        </Box>

        <Stack justifyContent={'space-between'} gap={1}>
          <Row mt={4} rowGap={4} alignItems="center" justifyContent={'center'}>
            <UserInfo />
            <Divider orientation="vertical" />
            <Button color="danger" variant="soft" onClick={handleLogout}>
              Выйти
            </Button>
          </Row>
          <P level="body-xs">
            Предложения: <strong>{SUPPORT_CONTACT.telegram}</strong> (Telegram)
            или <strong>{SUPPORT_CONTACT.email}</strong>
          </P>
        </Stack>
      </Box>
    </>
  )
})
