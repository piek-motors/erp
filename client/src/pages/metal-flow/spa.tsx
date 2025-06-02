import { Box, Stack } from '@mui/joy'
import { useLocation } from 'react-router-dom'
import { NavigationSideBar } from './nav'
import { getComponentByCurrentPath } from './routes'

export function MetalFlowSubSystem() {
  const path = new URLSearchParams(useLocation().search).get('path')
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
      <Box p={1}>
        <NavigationSideBar />
      </Box>
      {path && (
        <Stack sx={{ flexGrow: 1, gap: 1, p: 1 }}>
          {path ? getComponentByCurrentPath(path) : null}
        </Stack>
      )}
    </Box>
  )
}
