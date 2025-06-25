import { Box, Container, Stack } from '@mui/joy'
import { NavigationSideBar } from './nav'

export function MetalFlowRootLayout(props: { children?: React.ReactNode }) {
  return (
    <Container maxWidth="xl">
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
          <Stack sx={{ flexGrow: 1, gap: 1, p: 0 }}>{props.children}</Stack>
        )}
      </Box>
    </Container>
  )
}
