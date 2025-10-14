import { BoxProps } from '@mui/joy'
import { Box } from 'lib'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export const ScrollPreservNavigation = ({
  children,
  refreshTrigger,
  sx
}: {
  children: React.ReactNode
  refreshTrigger: any
  sx?: BoxProps['sx']
}) => {
  const containerRef = useRef<any>(null)
  const scrollPosition = useRef(0)
  const location = useLocation()

  // Create a unique key for this page
  const storageKey = `scroll-position-${location.pathname}`

  // Save scroll position before the re-render happens (for search/filter changes)
  useLayoutEffect(() => {
    if (containerRef.current) {
      scrollPosition.current = containerRef.current.scrollTop
    }
  }, [refreshTrigger])

  // Restore scroll position after render (for search/filter changes)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition.current
    }
  }, [refreshTrigger])

  // Save scroll position to sessionStorage when component unmounts (navigation away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (containerRef.current) {
        sessionStorage.setItem(
          storageKey,
          containerRef.current.scrollTop.toString()
        )
      }
    }

    const saveScrollOnNavigation = () => {
      if (containerRef.current) {
        sessionStorage.setItem(
          storageKey,
          containerRef.current.scrollTop.toString()
        )
      }
    }

    // Save on scroll changes
    const handleScroll = () => {
      if (containerRef.current) {
        sessionStorage.setItem(
          storageKey,
          containerRef.current.scrollTop.toString()
        )
      }
    }

    // Save on page unload
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Save when navigating (cleanup function runs when component unmounts)
    return () => {
      saveScrollOnNavigation()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [storageKey])

  // Restore scroll position from sessionStorage when component mounts (navigation back)
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(storageKey)
    if (savedPosition && containerRef.current) {
      // Use requestAnimationFrame to ensure the content is rendered first
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = parseInt(savedPosition, 10)
        }
      })
    }
  }, [storageKey, location.pathname])

  // Save scroll position periodically while user is scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const saveScrollPosition = () => {
      sessionStorage.setItem(storageKey, container.scrollTop.toString())
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(saveScrollPosition, 100) // Debounce saves
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [storageKey])

  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1, ...sx }} ref={containerRef}>
      {children}
    </Box>
  )
}
