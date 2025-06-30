import { Stack } from '@mui/joy'
import { observer, P } from 'lib/index'
import { detailGroupStore, Group } from './store'

export const DetailGroupList = observer(() => {
  const handleGroupSelect = (group: Group) => {
    detailGroupStore.loadGroupWithDetails(group.id)
  }
  if (detailGroupStore.groups.length === 0) {
    return (
      <P level="body-sm" color="neutral">
        Нет созданных групп
      </P>
    )
  }
  return (
    <Stack>
      {detailGroupStore.groups.map(group => {
        const isSelected = detailGroupStore.selectedGroup?.group.id === group.id
        return (
          <P
            color={isSelected ? 'primary' : 'neutral'}
            sx={{ flex: 1, py: 0.7, cursor: 'pointer' }}
            onClick={() => handleGroupSelect(group)}
          >
            {group.name}
          </P>
        )
      })}
    </Stack>
  )
})
