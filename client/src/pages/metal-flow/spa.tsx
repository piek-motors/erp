import { Box, Stack } from '@mui/joy'
import { NavigationSideBar } from './nav'

export function MetalFlowLayout(props: { children?: React.ReactNode }) {
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
      {props.children && (
        <Stack sx={{ flexGrow: 1, gap: 0, p: 1 }}>{props.children}</Stack>
      )}
    </Box>
  )
}
