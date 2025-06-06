import { __DEV__ } from '@apollo/client/utilities/globals'
import { Box, IconButton, Stack, Typography } from '@mui/joy'
import { SxProperty } from 'lib/constants'
import React from 'react'
import { Link } from 'react-router-dom'
import { Row } from '../lib/shortcuts'

export interface Props {
  title: string
  subTitle?: string | null
  sx?: SxProperty
  children?: React.ReactNode
  hideIcon?: boolean
  spaceBetween?: boolean
}

export function PageTitle(props: Props) {
  return (
    <Stack direction="row" gap={1} pb={1}>
      {!props.hideIcon && (
        <Link to="/help">
          <IconButton
            variant="outlined"
            sx={{ background: __DEV__ ? 'red' : 'transparent' }}
          >
            <img src={'/favicon.ico'} width={20} height={20} />
          </IconButton>
        </Link>
      )}

      <Row gap={2} sx={props.sx}>
        <Typography
          color="primary"
          fontWeight={600}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {props.title}
        </Typography>
        {props.subTitle && (
          <Typography level="body-md">{props.subTitle}</Typography>
        )}
      </Row>
      {props.spaceBetween && <Box sx={{ width: '100%' }} />}
      <Box>{props.children}</Box>
    </Stack>
  )
}
