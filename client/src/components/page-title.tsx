import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/joy'
import React from 'react'
import { Link } from 'react-router-dom'
import { SxProperty } from 'src/lib/constants'
import { Row } from '../shortcuts'

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
    <Stack direction="row" gap={2} p={1}>
      {!props.hideIcon && (
        <Tooltip title="Перейти на главную страницу">
          <Link to="/help">
            <IconButton variant="outlined">
              <img src={'/favicon.ico'} width={20} height={20} />
            </IconButton>
          </Link>
        </Tooltip>
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
