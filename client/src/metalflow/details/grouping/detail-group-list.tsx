import { Stack } from '@mui/joy'
import { observer, P } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { Link } from 'react-router-dom'
import { detailGroupStore } from './store'

export const DetailGroupList = observer(() => {
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
          <Link
            key={group.id}
            to={open(routeMap.metalflow.detailGroup, group.id)}
            style={{ textDecoration: 'none' }}
          >
            <P
              color={isSelected ? 'primary' : 'neutral'}
              sx={{ flex: 1, py: 0.7, cursor: 'pointer' }}
            >
              {group.name}
            </P>
          </Link>
        )
      })}
    </Stack>
  )
})
