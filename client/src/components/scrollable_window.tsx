import { SxProps } from '@mui/joy/styles/types'
import { ScrollPreserv } from 'components/utilities/scroll_preserve'
import { ScrollPreservNavigation } from 'components/utilities/scroll_preserve_navigation'
import { Box, Stack } from 'lib'

export const ScrollableWindow = (props: {
  scroll: React.ReactNode
  static?: React.ReactNode
  refreshTrigger?: any
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
    <Stack sx={{ ...outerSx, overflowX: 'scroll', width: '100%' }}>
      {props.static && (
        <Box sx={{ p: { xs: 0.75, sm: 0 } }}>{props.static}</Box>
      )}
      <ScrollComponent refreshTrigger={props.refreshTrigger} sx={scrollSx}>
        <Box sx={{ width: '100%' }}>{props.scroll}</Box>
      </ScrollComponent>
    </Stack>
  )
}
