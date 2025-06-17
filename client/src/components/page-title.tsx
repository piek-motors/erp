import { Box, IconButton, Stack } from '@mui/joy'
import { SxProperty } from 'lib/constants'
import { routeMap } from 'lib/routes'
import React from 'react'
import { Link } from 'react-router-dom'
import { MobileOnly, P, Row } from '../lib/shortcuts'

export interface Props {
  title?: string
  subTitle?: string | null
  sx?: SxProperty
  children?: React.ReactNode
  hideIcon?: boolean
  spaceBetween?: boolean
  mobileMenu?: React.ReactNode
}

export function PageTitle(props: Props) {
  const isDev = process.env.REACT_APP_NODE_ENV === 'development'

  return (
    <Stack direction="row" gap={1} pb={1}>
      {!props.hideIcon && (
        <Link to={routeMap.index}>
          <IconButton
            variant="outlined"
            sx={{
              background: isDev ? 'red' : 'transparent'
            }}
          >
            <img src={'/favicon.ico'} width={20} height={20} />
          </IconButton>
        </Link>
      )}

      <Row gap={2} sx={props.sx}>
        {props.title && (
          <P color="primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
            {props.title}
          </P>
        )}
        {props.subTitle && (
          <P level="body-sm" fontWeight={500}>
            {props.subTitle}
          </P>
        )}
      </Row>
      {props.spaceBetween && <Box sx={{ width: '100%' }} />}
      <Box>{props.children}</Box>
      <MobileOnly sx={{ ml: 'auto' }}>{props.mobileMenu}</MobileOnly>
    </Stack>
  )
}
