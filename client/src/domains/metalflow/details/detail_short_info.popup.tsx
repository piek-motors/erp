import { UilInfoCircle } from '@iconscout/react-unicons'
import {
  Divider,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack
} from '@mui/joy'
import { cache } from 'domains/metalflow/cache/root'
import { Label, observer, P, UseIcon, useState } from 'lib/index'
import { Detail } from './detail.store'

interface DetailParamsPopupProps {
  detailId: number
}

const Pair = (props: { label?: string; value?: string | null }) => {
  if (!props.value) return null
  return (
    <MenuItem sx={{ display: 'flex', alignItems: 'baseline' }}>
      {props.label && (
        <>
          <Label level="body-xs">{props.label}</Label>
          <Divider orientation="vertical" />
        </>
      )}
      <P level="body-sm">{props.value}</P>
    </MenuItem>
  )
}

export const DetailShortInfoPopup = observer(
  ({ detailId }: DetailParamsPopupProps) => {
    const [detail] = useState(() => new Detail())
    return (
      <Dropdown>
        <MenuButton
          loading={detail.async.loading}
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              size: 'sm',
              variant: 'outlined',
              color: 'neutral',
              onClick: e => {
                e.stopPropagation()
                detail.reset()
                detail.loadFullInfo(detailId)
              }
            }
          }}
        >
          <UseIcon icon={UilInfoCircle} small />
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
          <Pair value={detail.name} />
          <Pair label="Номер чертежа" value={detail.drawingNumber} />
          <Pair
            label="Группа"
            value={cache.detailGroups.getGroupName(detail.groupId)}
          />
          <Pair label="Примечания" value={detail.description} />
          {detail.technicalParameters && (
            <MenuItem>
              <Stack gap={0.5}>
                {Object.keys(detail.technicalParameters).length > 0 && (
                  <Stack gap={0.5}>
                    <Label>Параметры</Label>
                    {Object.entries(detail.technicalParameters).map(
                      ([key, value]) => (
                        <P
                          key={key}
                          level="body-xs"
                          color="neutral"
                          sx={{ ml: 0.5 }}
                        >
                          {key}: {String(value)}
                        </P>
                      )
                    )}
                  </Stack>
                )}
              </Stack>
            </MenuItem>
          )}
        </Menu>
      </Dropdown>
    )
  }
)
