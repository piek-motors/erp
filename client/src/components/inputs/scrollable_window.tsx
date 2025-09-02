import { SxProps } from '@mui/joy/styles/types'
import { ScrollPreserv } from 'components/utilities/scroll_preserve'
import { ScrollPreservNavigation } from 'components/utilities/scroll_preserve_navigation'
import { Box, Sheet, Stack } from 'lib'

function Wrapper(props: {
  children: React.ReactNode
  sx: SxProps
  useSheet: boolean
}) {
  if (props.useSheet)
    return <Sheet sx={{ ...props.sx }}>{props.children}</Sheet>
  return <Box sx={{ ...props.sx }}>{props.children}</Box>
}

export const ScrollableWindow = (props: {
  staticContent?: React.ReactNode
  scrollableContent: React.ReactNode
  refreshTrigger: any
  useSheet?: boolean
  preserveScrollAcrossNavigation?: boolean
  height?: string | number
  maxHeight?: string | number
  minHeight?: string | number
  overflowX?: 'hidden' | 'auto' | 'scroll'
  overflowY?: 'hidden' | 'auto' | 'scroll'
  containerSx?: SxProps
  scrollSx?: SxProps
  contentSx?: SxProps
}) => {
  const ScrollComponent =
    props.preserveScrollAcrossNavigation !== false
      ? ScrollPreservNavigation
      : ScrollPreserv
  const overflowX = props.overflowX ?? 'auto'
  const overflowY = props.overflowY ?? 'auto'
  const outerSx = {
    height: props.height,
    maxHeight: props.height ? undefined : props.maxHeight ?? '100vh',
    minHeight: props.minHeight ?? 0,
    ...props.containerSx
  } as SxProps
  const scrollSx = {
    overflowX,
    overflowY,
    flex: '1 1 auto',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
    scrollbarGutter: 'stable both-edges',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
    ...props.scrollSx
  } as SxProps
  return (
    <Stack sx={outerSx}>
      {props.staticContent}
      <ScrollComponent refreshTrigger={props.refreshTrigger} sx={scrollSx}>
        <Wrapper
          sx={{ width: '100%', ...props.contentSx }}
          useSheet={props.useSheet ?? true}
        >
          <Box sx={{ width: '100%' }}>{props.scrollableContent}</Box>
        </Wrapper>
      </ScrollComponent>
      <Box p={0.5}></Box>
    </Stack>
  )
}
