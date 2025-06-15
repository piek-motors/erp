/** @jsxImportSource @emotion/react */
import { Box, Stack } from '@mui/joy'
import { ScrollPreserv } from 'components/scroll-preserve'
import { Detail } from 'domain-model'
import { observer } from 'lib/deps'
import { Inp, Label, P } from 'lib/shortcuts'
import { DetailsList } from 'pages/metal-flow/detail/detail-list'
import { writeoffStore } from '../writeoff.store'

export const WriteoffThroughDetail = observer(() => {
  return (
    <>
      {writeoffStore.throughDetail.detail && (
        <Box gap={1}>
          <Label label="Деталь" />
          <P level="body-lg">{writeoffStore.throughDetail.detail.name}</P>
        </Box>
      )}
      <Inp
        label="Кол-во"
        type="number"
        value={writeoffStore.throughDetail.qty || ''}
        onChange={v => {
          writeoffStore.throughDetail.setQty(v)
        }}
      />
      {/* {store.detail && <TotalCost detail={store.detail} qty={store.qty} />} */}
    </>
  )
})

export const WriteoffThroughDetailSidePanel = observer(() => {
  const highlight = (detail: Detail) => {
    return detail.id == writeoffStore.throughDetail.detail?.id
  }
  return (
    <Stack sx={{ maxHeight: '100vh' }}>
      <Box p={1}></Box>
      <ScrollPreserv refreshTrigger={writeoffStore.throughDetail.detail?.id}>
        <DetailsList
          onRowClick={detail => writeoffStore.throughDetail.setDetail(detail)}
          highlight={detail => highlight(detail)}
          highlightColor="#97c3f098"
        />
      </ScrollPreserv>
      <Box p={1}></Box>
    </Stack>
  )
})
