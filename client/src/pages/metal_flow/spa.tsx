import { Box, Stack } from '@mui/material'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MetalFlowSys } from '../../lib/routes'
import { getComponent } from './main'
import { Nav } from './nav'
import { WorkPage } from './shared/basic'
import { useStockStore } from './stock'

export function SPA() {
  const path = new URLSearchParams(useLocation().search).get('path')
  const stockStore = useStockStore()

  useEffect(() => {
    stockStore.load()
  }, [])

  return (
    <Stack
      direction={'row'}
      gap={1}
      sx={{
        height: '100vh',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <Box
        sx={{
          display: {
            xs: path ? 'none' : 'block',
            sm: 'block'
          }
        }}
      >
        <Nav />
      </Box>
      {path && (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            minWidth: ''
          }}
        >
          <WorkPage>{(path && getComponent(path)) || <></>}</WorkPage>
        </Box>
      )}
    </Stack>
  )
}

export function goTo(
  to: MetalFlowSys,
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
