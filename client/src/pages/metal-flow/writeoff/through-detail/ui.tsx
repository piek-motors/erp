/** @jsxImportSource @emotion/react */
import { Box } from '@mui/joy'
import { ScrollPreserv } from 'components/scroll-preserve'
import { Detail } from 'domain-model'
import { observer } from 'lib/deps'
import { Inp, Label, P } from 'lib/shortcuts'
import { DetailsList } from 'pages/metal-flow/detail/detail-list'
import { t } from '../../text'
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
        label={t.Qty}
        type="number"
        value={writeoffStore.throughDetail.qty || ''}
        onChange={v => {
          const isNumber = Number.isFinite(Number(v))
          writeoffStore.throughDetail.setQty(isNumber ? Number(v) : 0)
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
    <ScrollPreserv refreshTrigger={writeoffStore.throughDetail.detail?.id}>
      <DetailsList
        onRowClick={detail => writeoffStore.throughDetail.setDetail(detail)}
        highlight={detail => highlight(detail)}
        highlightColor="#97c3f098"
      />
    </ScrollPreserv>
  )
})
