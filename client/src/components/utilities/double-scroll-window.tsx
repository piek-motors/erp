import { Divider } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { Box, Stack } from 'lib'

type Props = {
  first: React.ReactNode
  second: React.ReactNode
  orientation?: 'vertical' | 'horizontal'
  collapseOnSmallScreens?: boolean
  height?: string | number
  maxHeight?: string | number
  minHeight?: string | number
  gap?: number | string
  firstFlexGrow?: number
  secondFlexGrow?: number
  firstSx?: SxProps
  secondSx?: SxProps
  containerSx?: SxProps
}

export function DoubleScrollWindow(props: Props) {
  const split = props.orientation ?? 'horizontal'
  const isVertical = split === 'vertical'
  const collapse = props.collapseOnSmallScreens !== false
  const collapsedOnSmall = !isVertical && collapse
  const outerSx: SxProps = {
    height: collapsedOnSmall
      ? { xs: 'auto', md: props.height ?? '100vh' }
      : (props.height ?? '100vh'),
    maxHeight: props.height
      ? undefined
      : collapsedOnSmall
        ? { xs: undefined, md: props.maxHeight }
        : props.maxHeight,
    minHeight: props.minHeight ?? 0,
    ...props.containerSx,
  }
  const paneBase: SxProps = {
    overflowX: collapsedOnSmall ? { xs: 'visible', md: 'auto' } : 'auto',
    overflowY: collapsedOnSmall ? { xs: 'visible', md: 'auto' } : 'auto',
    flex: collapsedOnSmall ? { xs: '0 0 auto', md: '1 1 0' } : '1 1 0',
    minHeight: collapsedOnSmall ? { xs: 'auto', md: 0 } : 0,
    minWidth: 0,
    width: '100%',
    scrollbarGutter: 'stable both-edges',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
  }
  const direction = isVertical
    ? 'column'
    : collapse
      ? ({ xs: 'column', md: 'row' } as const)
      : 'row'

  const divider = (
    <Divider
      orientation={props.orientation === 'vertical' ? 'horizontal' : 'vertical'}
    />
  )
  return (
    <Stack direction={direction} gap={props.gap ?? 0.5} sx={outerSx}>
      <Box
        sx={{
          ...paneBase,
          flex: collapsedOnSmall
            ? { xs: '0 0 auto', md: `${props.firstFlexGrow ?? 1} 1 0` }
            : `${props.firstFlexGrow ?? 1} 1 0`,
          ...props.firstSx,
        }}
      >
        {props.first}
      </Box>
      {divider}
      <Box
        sx={{
          ...paneBase,
          flex: collapsedOnSmall
            ? { xs: '0 0 auto', md: `${props.secondFlexGrow ?? 1} 1 0` }
            : `${props.secondFlexGrow ?? 1} 1 0`,
          ...props.secondSx,
        }}
      >
        {props.second}
      </Box>
    </Stack>
  )
}
