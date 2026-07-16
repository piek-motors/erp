/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AddCircleRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  type ButtonProps,
  IconButton,
  Stack,
  type StackProps,
  Tooltip,
} from '@mui/joy'
import type { ReactNode } from 'react'
import { Link as RouterLink, useLocation } from 'react-router'
import { NavTopBar } from '@/components/nav_topbar'
import { type Icon, UseIcon } from '@/lib'

export type Link = {
  name?: string
  href: string
  icon?: Icon
  iconNode?: ReactNode
  tooltip?: string
  childres?: Link[]
  endBlock?: Link[]
}

export const NavigationSideBar = (
  props: StackProps & {
    title: string
    links: Link[]
  },
) => (
  <Stack gap={0.5} {...props}>
    <NavTopBar t={props.title} />
    {props.links.map(each => (
      <RenderAction action={each} key={each.href} size="sm" />
    ))}
  </Stack>
)

const RenderAction = (props: { action: Link; size: ButtonProps['size'] }) => {
  const { action, size } = props
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      sx={{ cursor: 'pointer' }}
      justifyContent={'space-between'}
    >
      <MenuButton
        href={action.href}
        name={action.name}
        icon={action.icon}
        iconNode={action.iconNode}
        size={size}
      />
      <Box alignItems={'center'}>
        {action.endBlock?.length && (
          <Stack>
            {action.endBlock?.map(e => (
              <LinkableIcon
                href={e.href}
                iconNode={e.iconNode}
                tooltip={e.tooltip}
                small
                key={e.href}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

function MenuButton(props: {
  href: string
  name?: string
  icon?: Icon
  iconNode?: ReactNode
  size: ButtonProps['size']
}) {
  const location = useLocation()
  const isActive = location.pathname === props.href
  return (
    <RouterLink to={props.href} key={props.href} css={css`width: 100%;`}>
      <Button
        sx={{
          textAlign: 'left',
          lineHeight: 1,
          width: '100%',
          justifyContent: 'start',
          '&:hover svg': {
            opacity: 1,
          },
        }}
        variant={isActive ? 'soft' : 'plain'}
        color={'neutral'}
        size={'sm'}
        startDecorator={
          props.iconNode ?? (props.icon && <UseIcon icon={props.icon} small />)
        }
      >
        {props.name}
      </Button>
    </RouterLink>
  )
}

const LinkableIcon = (props: {
  href: string
  iconNode?: ReactNode
  small?: boolean
  tooltip?: string
}) => (
  <Box key={props.href}>
    <RouterLink to={props.href} key={props.href}>
      <Tooltip title={props.tooltip} size="sm" placement="right">
        <IconButton
          size="sm"
          variant={props.href === useLocation().pathname ? 'soft' : 'plain'}
        >
          {props.iconNode ?? <UseIcon icon={AddCircleRounded} small />}
        </IconButton>
      </Tooltip>
    </RouterLink>
  </Box>
)
