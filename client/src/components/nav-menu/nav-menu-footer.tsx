import { Button, Divider, Stack } from '@mui/joy'
import { P, Row } from '@/lib/index'
import { authStore } from '@/lib/store/auth.store'
import { SUPPORT_CONTACT } from './menu-links'
import { ThemeModeSwitch } from './theme-mode-switch'

interface NavMenuFooterProps {
  onLogout: () => void
}

export const NavMenuFooter = ({ onLogout }: NavMenuFooterProps) => {
  return (
    <Stack justifyContent="space-between" gap={1}>
      <ThemeModeSwitch />
      <Row mt={4} rowGap={4} alignItems="center" justifyContent="center">
        <UserInfo />
        <Divider orientation="vertical" />
        <Button color="danger" variant="soft" onClick={onLogout}>
          Выйти
        </Button>
      </Row>
      <P level="body-xs">
        Предложения: <strong>{SUPPORT_CONTACT.telegram}</strong> (Telegram) или{' '}
        <strong>{SUPPORT_CONTACT.email}</strong>
      </P>
    </Stack>
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
