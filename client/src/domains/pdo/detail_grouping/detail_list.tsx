import { Box, Button } from '@mui/joy'
import { Search } from 'components/inputs'
import { observer, P, Stack, useEffect } from 'lib/index'
import { api } from './api'
import { DetailRow } from './detail_row'
import { UniversalDetailsModalSelect } from './detail_selection'

export const GroupActions = observer(() => {
  const openedGroup = api.store.openedGroup
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {openedGroup && <UniversalDetailsModalSelect />}
      {openedGroup && api.store.selectedDetailIds.length > 0 && (
        <Button
          size="sm"
          variant="soft"
          color="danger"
          onClick={async () => {
            if (api.store.openedGroup == null) return
            await api.removeDetailsFromGroup(
              api.store.openedGroup.group.id,
              api.store.selectedDetailIds
            )
          }}
          disabled={api.store.selectedDetailIds.length === 0}
        >
          Исключить [{api.store.selectedDetailIds.length}]
        </Button>
      )}
    </Stack>
  )
})

export const TargetGroupDetailList = observer(() => {
  useEffect(() => {
    api.store.setQuery()
  }, [])

  if (api.store.openedGroup?.details.length === 0)
    return (
      <P level="body-sm" color="neutral">
        В группе нет деталей
      </P>
    )

  return (
    <Stack sx={{ flex: 1 }}>
      <Search
        size="sm"
        variant="soft"
        color="primary"
        value={api.store.query}
        onChange={e => api.store.setQuery(e.target.value)}
      />
      {/* <ColorSegmentationMenu /> */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto'
          // columnGap: 1
          // display: 'grid',
          // gridTemplateColumns: 'auto 6fr'
        }}
      >
        {api.store.targetGroupDetails?.map(detail => (
          <DetailRow
            key={detail.id}
            detail={detail}
            onToggle={() => {
              api.store.toggleDetailSelection(detail.id)
            }}
            isSelected={api.store.selectedDetailIds.includes(detail.id)}
          />
        ))}
      </Box>
    </Stack>
  )
})
