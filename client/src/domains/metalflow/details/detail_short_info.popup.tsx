import { UilInfoCircle } from '@iconscout/react-unicons'
import { Box, Dropdown, Menu, MenuButton, MenuItem, Stack } from '@mui/joy'
import { ExtraSmallIconButton } from 'components/buttons'
import { cache } from 'domains/metalflow/cache/root'
import { Label, observer, P, useState } from 'lib/index'
import { Detail } from './store'

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

export const DetailShortInfoPopup = observer(
  ({ detailId }: DetailParamsPopupProps) => {
    const [detail] = useState(() => new Detail())
    return (
      <Dropdown>
        <MenuButton
          loading={detail.async.loading}
          slots={{ root: Box }}
          slotProps={{
            root: {
              onClick: e => {
                e.stopPropagation()
                detail.reset()
                detail.loadFullInfo(detailId)
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
          <Pair value={detail.name} />
          <Pair label="Номер чертежа" value={detail.drawingNumber} />
          <Pair
            label="Группа"
            value={cache.detailGroups.getGroupName(detail.groupId)}
          />
          <Pair label="Примечания" value={detail.description} />
          {detail.technicalParameters &&
            detail.technicalParameters?.arr?.length > 0 && (
              <MenuItem>
                <Stack gap={0.5}>
                  <Label>Параметры</Label>
                  {detail.technicalParameters.arr.map(({ key, value }, idx) => (
                    <P
                      key={key + idx}
                      level="body-xs"
                      color="neutral"
                      sx={{ ml: 0.5 }}
                    >
                      {key}: {String(value)}
                    </P>
                  ))}
                </Stack>
              </MenuItem>
            )}
        </Menu>
      </Dropdown>
    )
  }
)
