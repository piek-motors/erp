import { UilInfoCircle } from '@iconscout/react-unicons'
import { Box, Dropdown, Menu, MenuButton, MenuItem, Stack } from '@mui/joy'
import { ExtraSmallIconButton } from 'components/buttons'
import { cache } from 'domains/pdo/cache/root'
import { Label, observer, P, useState } from 'lib/index'
import { DetailApi } from './api'
import { DetailState } from './detail.state'

const Pair = (props: { label?: string; value?: string | null }) => {
  if (!props.value) return null
  return (
    <MenuItem sx={{ display: 'flex', alignItems: 'baseline' }}>
      <Stack>
        {props.label && (
          <Label level="body-xs" color="warning">
            {props.label}
          </Label>
        )}
        <P>{props.value}</P>
      </Stack>
    </MenuItem>
  )
}

export const DetailInfoPopup = observer(
  ({ detail: d }: { detail: DetailState }) => {
    const [api] = useState(() => new DetailApi())
    return (
      <Dropdown>
        <MenuButton
          loading={api.loader.loading}
          slots={{ root: Box }}
          slotProps={{
            root: {
              onClick: e => {
                e.stopPropagation()
                d.reset()
                api.loadShort(d.id!)
              }
            }
          }}
        >
          <ExtraSmallIconButton icon={UilInfoCircle} />
        </MenuButton>
        <Menu
          variant="plain"
          size="sm"
          onClick={e => {
            e.stopPropagation()
          }}
          sx={{
            maxWidth: '500px'
          }}
        >
          <Pair value={d.name} />
          <Pair label="Номер чертежа" value={d.drawingNumber} />
          <Pair
            label="Группа"
            value={cache.detailGroups.getGroupName(d.groupId!)}
          />
        </Menu>
      </Dropdown>
    )
  }
)
