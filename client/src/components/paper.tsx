/** @jsxImportSource @emotion/react */
import { Box } from '@mui/material'
import { ReactNode } from 'react'
import { SxProperty } from 'src/lib/constants'

export function PaperL1({
  children,
  sx
}: {
  children: ReactNode
  sx?: SxProperty
}) {
  return (
    <Box
      sx={{
        background: 'var(--L1)',
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

export function PaperL2({
  children,
  sx
}: {
  children: ReactNode
  sx?: SxProperty
}) {
  return (
    <Box
      sx={{
        background: 'var(--L2)',
        borderRadius: 'var(--br)',
        ...sx
      }}
    >
      {children}
    </Box>
  )
}
