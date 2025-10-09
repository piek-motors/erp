import { Button, List } from '@mui/joy'
import { observer, P, Stack } from 'lib/index'
import { crud } from './api'
import { DetailRow } from './detail_row'
import { UniversalDetailsModalSelect } from './detail_selection'

export const GroupActions = observer(() => {
  const openedGroup = crud.store.targetGroup
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {openedGroup && <UniversalDetailsModalSelect />}
      {openedGroup && crud.store.selectedDetailIds.length > 0 && (
        <Button
          size="sm"
          variant="soft"
          color="danger"
          onClick={async () => {
            if (crud.store.targetGroup == null) return
            await crud.removeDetailsFromGroup(
              crud.store.targetGroup.group.id,
              crud.store.selectedDetailIds
            )
          }}
          disabled={crud.store.selectedDetailIds.length === 0}
        >
          Исключить [{crud.store.selectedDetailIds.length}]
        </Button>
      )}
    </Stack>
  )
})

export const TargetGroupDetailList = observer(() => {
  if (crud.store.targetGroup?.details.length === 0) {
    return (
      <P level="body-sm" color="neutral">
        В группе нет деталей
      </P>
    )
  }

  return (
    <Stack sx={{ flex: 1 }}>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {crud.store.targetGroup?.details.map(detail => (
          <DetailRow
            key={detail.id}
            detail={detail}
            onToggle={() => {
              crud.store.toggleDetailSelection(detail.id)
            }}
            isSelected={crud.store.selectedDetailIds.includes(detail.id)}
          />
        ))}
      </List>
    </Stack>
  )
})
