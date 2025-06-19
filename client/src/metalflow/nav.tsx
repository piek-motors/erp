import { UilPlusCircle } from '@iconscout/react-unicons'
import { Box, Button, ButtonProps, IconButton, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { DesktopOnly, UseIcon } from 'lib/index'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Action, actions } from './nav.links'
import { MobileMenuButton } from './shared/mobile-menu.button'
import { t } from './text'

export function NavigationSideBar() {
  return (
    <Stack>
      <PageTitle title={t.PdoModuleTitle} mobileMenu={<MobileMenuButton />} />
      <DesktopOnly>
        <Stack gap={1} py={1}>
          {actions.map(each => (
            <RenderAction action={each} key={each.href} size="sm" />
          ))}
        </Stack>
      </DesktopOnly>
    </Stack>
  )
}

export function MobileNavigationLinks() {
  return (
    <Stack gap={1} py={1}>
      {actions.map(each => (
        <RenderAction action={each} key={each.href} size="lg" />
      ))}
    </Stack>
  )
}

function RenderAction(props: { action: Action; size: ButtonProps['size'] }) {
  const { action, size } = props
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      justifyContent="space-between"
      sx={{ cursor: 'pointer' }}
    >
      <MenuButton href={action.href} name={action.name} size={size} />

      <Box px={2}>
        {action.endBlock?.length && (
          <Stack>
            {action.endBlock?.map(e => (
              <Box key={e.href}>
                <LinkableIcon href={e.href} />
              </Box>
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
  icon?: ReactNode
  size: ButtonProps['size']
}) {
  const location = useLocation()
  const path = location.pathname
  return (
    <Link to={props.href} key={props.href}>
      <Button
        variant={path === props.href ? 'solid' : 'soft'}
        size={props.size}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {props.name}
      </Button>
    </Link>
  )
}

function LinkableIcon(props: { href: string; small?: boolean }) {
  return (
    <Link to={props.href} key={props.href}>
      <IconButton
        size="sm"
        variant={props.href === useLocation().pathname ? 'soft' : 'plain'}
      >
        <UseIcon icon={UilPlusCircle} />
      </IconButton>
    </Link>
  )
}
