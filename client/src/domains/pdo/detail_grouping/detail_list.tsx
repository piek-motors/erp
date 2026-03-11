import { Box } from '@mui/joy'
import { Search } from '@/components/inputs'
import { observer, P, Stack, useEffect } from '@/lib/index'
import { api } from './api'
import { DetailRow } from './detail_row'

export const TargetGroupDetailList = observer(() => {
  const { detailList } = api.store
  useEffect(() => {
    detailList.setQuery('')
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
        value={detailList.query}
        onChange={e => detailList.setQuery(e.target.value)}
      />
      <Box
        sx={{
          flex: 1,
          pb: 2,
          overflow: 'auto',
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
