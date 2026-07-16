import { Box } from '@mui/joy'
import { useNavigate } from 'react-router'
import { AnimatedBackground } from '@/components/nav-menu/animated-background'
import { MenuGrid } from '@/components/nav-menu/menu-grid'
import { NavMenuFooter } from '@/components/nav-menu/nav-menu-footer'
import { useMentionsCount } from '@/components/nav-menu/use-mentions-count'
import { observer, P } from '@/lib/index'
import { authStore } from '@/lib/store/auth.store'

export const IndexPage = observer(() => {
  const navigate = useNavigate()
  const mentionsCount = useMentionsCount()

  const handleLogout = async () => {
    await authStore.logout()
    navigate('/login')
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

        <MenuGrid mentionsCount={mentionsCount} />
        <NavMenuFooter onLogout={handleLogout} />
      </Box>
    </>
  )
})
