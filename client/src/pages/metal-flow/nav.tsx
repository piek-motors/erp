import { Box, Button, IconButton, Stack } from '@mui/joy'
import { Link } from 'react-router-dom'
import { PageTitle } from 'src/components'
import { Action, actions } from './module.actions'
import { t } from './text'

export function NavigationBlock() {
  return (
    <Stack p={1}>
      <PageTitle title={t.PdoModuleTitle} />
      <Stack gap={2}>
        {actions.map(each => (
          <RenderAction action={each} key={each.href} />
        ))}
      </Stack>
    </Stack>
  )
}

function RenderAction(props: { action: Action }) {
  const { action } = props
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      justifyContent="space-between"
      sx={{ cursor: 'pointer' }}
    >
      <MenuButton href={action.href} name={action.name} />
      {action.endBlock?.length && (
        <Stack>
          {action.endBlock?.map(e => (
            <Box key={e.href}>
              <LinkableIcon
                href={e.href}
                icon={e.icon && <e.icon width={16} height={16} />}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

function MenuButton(props: {
  href: string
  name?: string
  icon?: any
  small?: boolean
}) {
  return (
    <Link to={`?path=${props.href}`} key={props.href}>
      <Button variant="plain" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
        {props.name}
      </Button>
    </Link>
  )
}

function LinkableIcon(props: { href: string; icon?: any; small?: boolean }) {
  return (
    <Link to={`?path=${props.href}`} key={props.href}>
      <IconButton>{props.icon}</IconButton>
    </Link>
  )
}
