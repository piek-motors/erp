import { UilCalculatorAlt } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { PageTitle } from 'src/components'
import { P } from 'src/shortcuts'
import { actions } from './actions'

interface Props {}

export const PdoModuleTitle = 'ПДО: Планирование материалов'

export function Nav(props: Props) {
  return (
    <>
      <Box
        sx={{
          p: 2
        }}
      >
        <Stack gap={3}>
          <PageTitle
            title={PdoModuleTitle}
            icon={<UilCalculatorAlt />}
            sx={{ pb: 1 }}
          />
          {actions.map(each => {
            return (
              <Stack>
                <Stack
                  direction="row"
                  alignItems={'center'}
                  justifyContent="space-between"
                  sx={{ cursor: 'pointer' }}
                >
                  <LinkableAction href={each.href} name={each.name} />
                  {each.endBlock?.length && (
                    <Stack pl={2}>
                      {each.endBlock?.map(e => (
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
              </Stack>
            )
          })}
        </Stack>
      </Box>
    </>
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
      <Button size={props.small ? 'small' : 'medium'}>
        <Stack direction="row" gap={1}>
          {props.icon}
          {props.name && <P>{props.name}</P>}
        </Stack>
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
      <IconButton size={props.small ? 'small' : 'medium'}>
        {props.icon}
      </IconButton>
    </Link>
  )
}
