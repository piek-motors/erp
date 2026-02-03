/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, type BoxProps } from '@mui/joy'
import { useEffect, useState } from 'react'

export const useMediaQuery = query => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = event => setMatches(event.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 600px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 600px)')

type Display = 'flex' | 'block' | 'inline-block' | 'inline' | 'none'

export function PrintOnly({
  children,
  display = 'flex' as Display,
}: {
  children: React.ReactNode
  display?: Display
}) {
  return (
    <div
      css={css`
        display: none !important;
        @media print {
          display: ${display} !important;
        }
      `}
    >
      {children}
    </div>
  )
}

export function WebOnly({
  children,
  display = 'flex' as Display,
}: {
  children: React.ReactNode
  display?: Display
}) {
  return (
    <div
      css={css`
        display: ${display} !important;
        @media print {
          display: none !important;
        }
      `}
    >
      {children}
    </div>
  )
}

export type Layout = typeof PrintOnly | typeof WebOnly

// create function to show content only on mobile and hide on desktop
export function MobileOnly(props: {
  children: React.ReactNode
  sx?: BoxProps['sx']
}) {
  const isMobile = useIsMobile()
  if (!isMobile) {
    return null
  }
  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' }, ...props.sx }}>
      {props.children}
    </Box>
  )
}

// create function to show content only on desktop and hide on mobile
export function DesktopOnly(props: {
  children: React.ReactNode
  sx?: BoxProps['sx']
}) {
  const isDesktop = useIsDesktop()
  if (!isDesktop) {
    return null
  }
  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, ...props.sx }}>
      {props.children}
    </Box>
  )
}
