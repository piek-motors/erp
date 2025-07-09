import { UilInfoCircle } from '@iconscout/react-unicons'
import {
  Box,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack
} from '@mui/joy'
import { observer, P, UseIcon } from 'lib/index'
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
              onClick: () => {
                detail.reset()
                detail.load(detailId)
              }
            }
          }}
        >
          <UseIcon icon={UilInfoCircle} small />
        </MenuButton>
        <Menu>
          <MenuItem>
            <Box sx={{ p: 1, minWidth: '250px' }}>
              <Stack gap={1}>
                <Stack gap={0.5}>
                  <P level="body-xs" color="neutral">
                    ID: {detail.id || 'Новый'}
                  </P>
                  <P level="body-xs" color="neutral">
                    Название: {detail.name}
                  </P>
                  {detail.partCode && (
                    <P level="body-xs" color="neutral">
                      Номер: {detail.partCode}
                    </P>
                  )}
                  {detail.groupId && (
                    <P level="body-xs" color="neutral">
                      Группа: {detail.groupId}
                    </P>
                  )}
                </Stack>

                {detail.params && Object.keys(detail.params).length > 0 && (
                  <Stack gap={0.5}>
                    <P level="body-xs" fontWeight="bold" sx={{ mt: 0.5 }}>
                      Параметры:
                    </P>
                    {Object.entries(detail.params).map(([key, value]) => (
                      <P
                        key={key}
                        level="body-xs"
                        color="neutral"
                        sx={{ ml: 1 }}
                      >
                        {key}: {String(value)}
                      </P>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Box>
          </MenuItem>
        </Menu>
      </Dropdown>
    )
  }
)
