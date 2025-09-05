import { UilInfoCircle } from '@iconscout/react-unicons'
import { Box, Dropdown, Menu, MenuButton, MenuItem, Stack } from '@mui/joy'
import { ExtraSmallIconButton } from 'components/buttons'
import { cache } from 'domains/metalflow/cache/root'
import { Label, observer, P, useState } from 'lib/index'
import { DetailApi } from './api'
import { TechParamsDisplay } from './components'

interface DetailParamsPopupProps {
  detailId: number
}

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
  ({ detailId }: DetailParamsPopupProps) => {
    const [api] = useState(() => new DetailApi())
    return (
      <Dropdown>
        <MenuButton
          loading={api.status.loading}
          slots={{ root: Box }}
          slotProps={{
            root: {
              onClick: e => {
                e.stopPropagation()
                api.detail.reset()
                api.loadShort(detailId)
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
          <Pair value={api.detail.name} />
          <Pair label="Номер чертежа" value={api.detail.drawingNumber} />
          <Pair
            label="Группа"
            value={cache.detailGroups.getGroupName(api.detail.groupId)}
          />
          <TechParamsDisplay level="body-xs" />
        </Menu>
      </Dropdown>
    )
  }
)
