import { Box, Sheet, Stack } from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import { DesktopOnly, MobileOnly } from 'lib/index'
import { useEffect } from 'react'
import { cache } from './cache/root'
import { MetalPageTitle } from './shared'
import { NavigationSideBar } from './shared/nav'

export const HomeButton = (props: { t?: string }) => (
  <MobileOnly>
    <MetalPageTitle t={props.t} />
  </MobileOnly>
)

export function MetalFlowRootLayout(props: { children?: React.ReactNode }) {
  useEffect(() => {
    cache.init()
  }, [])
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'start',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <DesktopOnly>
        <WebOnly>
          <NavigationSideBar />
        </WebOnly>
      </DesktopOnly>
      {props.children && (
        <Sheet sx={{ width: '100%', height: 'min-content' }}>
          <Stack sx={{ flexGrow: 1, gap: 1, overflowX: 'auto' }}>
            {props.children}
          </Stack>
        </Sheet>
      )}
    </Box>
  )
}
