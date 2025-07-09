import { UilInfoCircle } from '@iconscout/react-unicons'
import {
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack
} from '@mui/joy'
import { Label, observer, P, UseIcon } from 'lib/index'
import { cache } from 'metalflow/cache/root'
import { detailStore as detail } from './detail.store'

interface DetailParamsPopupProps {
  detailId: number
}

export const DetailParamsPopup = observer(
  ({ detailId }: DetailParamsPopupProps) => {
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              size: 'sm',
              variant: 'soft',
              color: 'neutral',
              onClick: e => {
                e.stopPropagation()
                detail.reset()
                detail.load(detailId)
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
          {detail.partCode && (
            <MenuItem>
              <Label>Артикул</Label>
              <P level="body-md">{detail.partCode}</P>
            </MenuItem>
          )}

          {detail.groupId && (
            <MenuItem>
              <Label>Группа</Label>
              <P level="body-md">
                {cache.detailGroups.getGroupName(detail.groupId)}
              </P>
            </MenuItem>
          )}

          {detail.description && (
            <MenuItem>
              <Stack>
                <Label>Примечания</Label>
                <P sx={{ whiteSpace: 'pre-wrap' }}>{detail.description}</P>
              </Stack>
            </MenuItem>
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
