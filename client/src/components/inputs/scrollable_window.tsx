import { SxProps } from '@mui/joy/styles/types'
import { ScrollPreserv } from 'components/utilities/scroll_preserve'
import { ScrollPreservNavigation } from 'components/utilities/scroll_preserve_navigation'
import { Box, Sheet, Stack } from 'lib'

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
  preserveScrollAcrossNavigation?: boolean
}) => {
  const ScrollComponent =
    props.preserveScrollAcrossNavigation !== false
      ? ScrollPreservNavigation
      : ScrollPreserv

  return (
    <Stack sx={{ maxHeight: '100vh' }}>
      {props.staticContent}
      <ScrollComponent refreshTrigger={props.refreshTrigger}>
        <Wrapper sx={{ overflowX: 'auto' }} useSheet={props.useSheet ?? true}>
          <Box>{props.scrollableContent}</Box>
        </Wrapper>
      </ScrollComponent>
      <Box p={0.5}></Box>
    </Stack>
  )
}
