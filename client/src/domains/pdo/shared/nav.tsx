import { UilPlusCircle } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Stack,
  StackProps
} from '@mui/joy'
import { NavigationBar } from 'components/navigation_bar'
import { UseIcon } from 'lib/index'
import { Link, useLocation } from 'react-router'
import { Action, actions } from '../nav.links'

const Navigations = () => (
  <>
    <NavigationBar t="ПДО" />
    {actions.map(each => (
      <RenderAction action={each} key={each.href} size="sm" />
    ))}
  </>
)

export const NavigationSideBar = (props: StackProps) => (
  <Stack gap={0.5} {...props}>
    <Navigations />
  </Stack>
)

const RenderAction = (props: { action: Action; size: ButtonProps['size'] }) => {
  const { action, size } = props
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      sx={{ cursor: 'pointer' }}
      justifyContent={'space-between'}
    >
      <MenuButton href={action.href} name={action.name} size={size} />
      <Box>
        {action.endBlock?.length && (
          <Stack>
            {action.endBlock?.map(e => (
              <Box key={e.href}>
                <LinkableIcon href={e.href} small />
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
  size: ButtonProps['size']
}) {
  const location = useLocation()
  const isActive = location.pathname === props.href
  return (
    <Link to={props.href} key={props.href}>
      <Button
        sx={{ textAlign: 'left', lineHeight: 1, width: 'min-content' }}
        variant={isActive ? 'soft' : 'plain'}
        color={'neutral'}
        size={'sm'}
      >
        {props.name}
      </Button>
    </Link>
  )
}

const LinkableIcon = (props: { href: string; small?: boolean }) => (
  <Link to={props.href} key={props.href}>
    <IconButton
      size="sm"
      variant={props.href === useLocation().pathname ? 'soft' : 'plain'}
    >
      <UseIcon icon={UilPlusCircle} small />
    </IconButton>
  </Link>
)
