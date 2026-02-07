import type { BoxProps } from '@mui/joy'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Box } from '@/lib'

export const ScrollPreserv = ({
  children,
  refreshTrigger,
  sx,
}: {
  children: React.ReactNode
  refreshTrigger: any
  sx?: BoxProps['sx']
}) => {
  const containerRef = useRef<any>(null)
  const scrollPosition = useRef(0)

  // Save scroll position before the re-render happens
  useLayoutEffect(() => {
    if (containerRef.current) {
      scrollPosition.current = containerRef.current.scrollTop
    }
  }, [refreshTrigger]) // change this to the prop or state that triggers re-renders

  // Restore scroll position after render
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition.current
    }
  }, [refreshTrigger])

  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1, ...sx }} ref={containerRef}>
      {children}
    </Box>
  )
}
