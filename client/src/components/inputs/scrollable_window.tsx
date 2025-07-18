import { SxProps } from '@mui/joy/styles/types'
import { Box, Sheet, Stack } from 'lib'
import { ScrollPreserv } from '../utilities/scroll_preserve'

function Wrapper(props: {
  children: React.ReactNode
  sx: SxProps
  useSheet: boolean
}) {
  if (props.useSheet) {
    return (
      <Sheet sx={{ overflowX: 'auto', ...props.sx }}>{props.children}</Sheet>
    )
  }
  return <Box sx={{ overflowX: 'auto', ...props.sx }}>{props.children}</Box>
}

export const ScrollableWindow = (props: {
  staticContent?: React.ReactNode
  scrollableContent: React.ReactNode
  refreshTrigger: any
  useSheet?: boolean
}) => {
  return (
    <Stack sx={{ maxHeight: '100vh' }}>
      {props.staticContent}
      <ScrollPreserv refreshTrigger={props.refreshTrigger}>
        <Wrapper sx={{ overflowX: 'auto' }} useSheet={props.useSheet ?? true}>
          <Box>{props.scrollableContent}</Box>
        </Wrapper>
      </ScrollPreserv>
      <Box p={0.5}></Box>
    </Stack>
  )
}
