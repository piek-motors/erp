import { Box, Stack } from '@mui/joy'
import { DesktopOnly } from 'lib/index'
import { useEffect } from 'react'
import { cache } from './cache/root'
import { NavigationSideBar } from './shared/nav'

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
        <NavigationSideBar />
      </DesktopOnly>
      {props.children && (
        <Stack sx={{ flexGrow: 1, gap: 1, p: 0 }}>{props.children}</Stack>
      )}
    </Box>
  )
}
