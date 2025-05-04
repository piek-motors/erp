import { Box } from '@mui/joy'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationBlock } from './nav'
import { getComponentByCurrentPath } from './routes'
import { useStockStore } from './stock'

export function MetalFlowSubsystem() {
  const path = new URLSearchParams(useLocation().search).get('path')
  const stockStore = useStockStore()

  useEffect(() => {
    stockStore.load()
  }, [])

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'start',
        gap: 2,
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <NavigationBlock />
      {path && (
        <Box sx={{ overflow: 'scroll', flexGrow: 1 }}>
          {(path && getComponentByCurrentPath(path)) || <></>}
        </Box>
      )}
    </Box>
  )
}

export function goTo(
  to: string,
  withId?: number,
  params: Record<string, any> = {}
) {
  let s = `?path=${to}`
  if (withId) {
    s = s.concat(`&id=${withId}`)
  }

  if (Object.keys(params).length > 0) {
    s = s.concat(`&${new URLSearchParams(params).toString()}`)
  }
  return s
}
