import { Box } from '@mui/joy'
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
        p: 1,
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <NavigationSideBar />
      {path && (
        <Box sx={{ overflow: 'scroll', flexGrow: 1 }}>
          {path ? getComponentByCurrentPath(path) : null}
        </Box>
      )}
    </Box>
  )
}

