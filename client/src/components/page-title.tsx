import { UilHome } from '@iconscout/react-unicons'
import { Box, IconButton, Stack } from '@mui/joy'
import { SxProperty } from 'lib/constants'
import { routeMap } from 'lib/routes'
import React from 'react'
import { Link } from 'react-router-dom'
import { MobileOnly, P, Row, UseIcon } from '../lib'

export interface Props {
  title?: string
  subTitle?: string | null
  sx?: SxProperty
  children?: React.ReactNode
  hideIcon?: boolean
  spaceBetween?: boolean
  homeUrl?: string
}

export function PageTitle(props: Props) {
  const isDev = process.env.REACT_APP_NODE_ENV === 'development'

  return (
    <Stack direction="row" gap={1}>
      {!props.hideIcon && (
        <Link to={routeMap.index}>
          <IconButton
            variant="outlined"
            size="sm"
            sx={{
              background: isDev ? 'red' : 'transparent'
            }}
          >
            <img src={'/favicon.ico'} width={20} height={20} />
          </IconButton>
        </Link>
      )}

      {/* Mobile-only metalflow navigation button */}
      {props.homeUrl && (
        <MobileOnly>
          <Link to={props.homeUrl}>
            <IconButton variant="soft" size="sm">
              <UseIcon icon={UilHome} />
            </IconButton>
          </Link>
        </MobileOnly>
      )}

      <Row gap={2} sx={props.sx}>
        {props.title && (
          <P color="primary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
            {props.title}
          </P>
        )}
        {props.subTitle && (
          <P level="body-sm" fontWeight={700}>
            {props.subTitle}
          </P>
        )}
      </Row>
      {props.spaceBetween && <Box sx={{ width: '100%' }} />}
      <Box>{props.children}</Box>
    </Stack>
  )
}
