import { UilHome } from '@iconscout/react-unicons'
import { Box, IconButton, Stack } from '@mui/joy'
import { SxProperty } from 'lib/constants'
import { routeMap } from 'lib/routes'
import React, { ReactNode } from 'react'
import { Link } from 'react-router'
import { P, Row, UseIcon } from '../lib'
import { MobileOnly } from './utilities/conditional-display'

export interface Props {
  t?: string | ReactNode
  subTitle?: string | null
  sx?: SxProperty
  children?: React.ReactNode
  hideIcon?: boolean
  spaceBetween?: boolean
  homeUrl?: string
}

export function NavTopBar(props: Props) {
  const isDev = process.env.REACT_APP_NODE_ENV === 'development'
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ minHeight: '36px', ...props.sx }}
    >
      {!props.hideIcon && (
        <Link to={routeMap.index}>
          <IconButton
            variant="outlined"
            size="md"
            sx={{
              background: isDev ? 'red' : undefined
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
            <IconButton variant="soft" size="md">
              <UseIcon icon={UilHome} />
            </IconButton>
          </Link>
        </MobileOnly>
      )}

      <Row gap={1} sx={{ ...props.sx }}>
        {props.t && typeof props.t === 'string' ? (
          <P
            color="primary"
            fontWeight={600}
            level="body-md"
            sx={{ width: 'max-content' }}
          >
            {props.t}
          </P>
        ) : (
          props.t
        )}
        {props.subTitle && (
          <P level="body-sm" fontWeight={600} sx={{ width: 'max-content' }}>
            {props.subTitle}
          </P>
        )}
      </Row>
      {props.spaceBetween && <Box sx={{ width: '100%' }} />}
      <Box sx={{ margin: 0 }}>{props.children}</Box>
    </Stack>
  )
}
