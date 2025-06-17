/** @jsxImportSource @emotion/react */
import { Box } from '@mui/joy'
import { Detail } from 'domain-model'
import { observer } from 'lib/deps'
import { Inp, Label, P } from 'lib/shortcuts'
import { DetailSelectWindow } from 'pages/metal-flow/detail/detail-list'
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
    <DetailSelectWindow
      refreshTrigger={writeoffStore.throughDetail.detail?.id}
      detailProps={{
        onRowClick: detail => writeoffStore.throughDetail.setDetail(detail),
        highlight: detail => highlight(detail),
        highlightColor: '#97c3f098'
      }}
    />
  )
})
