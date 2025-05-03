import { Box, Button, IconButton, Stack } from '@mui/joy'
import { Link } from 'react-router-dom'
import { PageTitle } from 'src/components'
import { Action, actions } from './module.actions'
import { t } from './text'

export function NavigationBlock() {
  return (
    <Stack>
      <PageTitle title={t.PdoModuleTitle} sx={{ pb: 1 }} />
      <Stack gap={3}>{actions.map(each => RenderAction(each))}</Stack>
    </Stack>
  )
}

function RenderAction(action: Action) {
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      justifyContent="space-between"
      sx={{ cursor: 'pointer' }}
    >
      <LinkableAction href={action.href} name={action.name} />
      {action.endBlock?.length && (
        <Stack pl={2}>
          {action.endBlock?.map(e => (
            <Box
              sx={{
                opacity: 0.6
              }}
            >
              <LinkableActionIcon
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

function LinkableAction(props: {
  href: string
  name?: string
  icon?: any
  small?: boolean
}) {
  return (
    <Link to={`?path=${props.href}`} key={props.href}>
      <Button variant="plain" color="neutral">
        {props.name}
      </Button>
    </Link>
  )
}

function LinkableActionIcon(props: {
  href: string
  icon?: any
  small?: boolean
}) {
  return (
    <Link to={`?path=${props.href}`} key={props.href}>
      <IconButton>{props.icon}</IconButton>
    </Link>
  )
}
