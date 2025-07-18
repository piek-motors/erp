import { Button, List } from '@mui/joy'
import { observer, P, Stack } from 'lib/index'
import { DetailRow } from './detail_row'
import { UniversalDetailsModalSelect } from './detail_selection/detail-selection-list'
import { store } from './store'

export const GroupActions = observer(() => {
  return (
    <Stack direction="row" alignItems="center" mb={1} gap={1}>
      <UniversalDetailsModalSelect />
      {store.selectedDetailIds.length > 0 && (
        <Button
          size="sm"
          variant="soft"
          color="danger"
          onClick={async () => {
            if (store.targetGroup == null) return
            await store.removeDetailsFromGroup(
              store.targetGroup.group.id,
              store.selectedDetailIds
            )
          }}
          disabled={store.selectedDetailIds.length === 0}
        >
          Исключить [{store.selectedDetailIds.length}]
        </Button>
      )}
    </Stack>
  )
})

export const TargetGroupDetailList = observer(() => {
  if (store.targetGroup == null) {
    return <EmptyState />
  }

  if (store.targetGroup?.details.length === 0) {
    return (
      <P level="body-sm" color="neutral">
        В группе нет деталей
      </P>
    )
  }

  return (
    <Stack sx={{ flex: 1 }}>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {store.targetGroup?.details.map(detail => (
          <DetailRow
            key={detail.id}
            detail={detail}
            onToggle={() => {
              store.toggleDetailSelection(detail.id)
            }}
            isSelected={store.selectedDetailIds.includes(detail.id)}
          />
        ))}
      </List>
    </Stack>
  )
})

function EmptyState() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: '400px' }}>
      <P color="neutral">Выберите группу для управления</P>
    </Stack>
  )
}
