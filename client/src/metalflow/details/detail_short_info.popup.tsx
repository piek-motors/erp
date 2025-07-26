import { UilInfoCircle } from '@iconscout/react-unicons'
import {
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack
} from '@mui/joy'
import { Label, observer, P, UseIcon, useState } from 'lib/index'
import { cache } from 'metalflow/cache/root'
import { Detail } from './detail.store'

interface DetailParamsPopupProps {
  detailId: number
}

const Pair = (props: { label: string; value?: string | null }) => {
  if (!props.value) return null
  return (
    <MenuItem sx={{ display: 'flex', alignItems: 'baseline' }}>
      <Label level="body-xs">{props.label}</Label>
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
          <Pair label="Название" value={detail.name} />
          <Pair label="Артикул" value={detail.partCode} />
          <Pair
            label="Группа"
            value={cache.detailGroups.getGroupName(detail.groupId)}
          />
          <Pair label="Примечания" value={detail.description} />
          {detail.updatedAt && (
            <Pair
              label="Обновлено"
              value={detail.updatedAt.toLocaleString('ru-RU')}
            />
          )}

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
