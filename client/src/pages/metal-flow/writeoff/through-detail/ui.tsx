/** @jsxImportSource @emotion/react */
import { FullscreenDialog } from 'components/fullscreen.dialog'
import { observer } from 'lib/deps'
import { Inp, Label, P, Row } from 'lib/shortcuts'
import { DetailSelectWindow } from 'pages/metal-flow/detail/detail-list'
import { WriteoffOpenListButton } from '../writeoff.shared'
import { writeoffStore } from '../writeoff.store'

export const WriteoffThroughDetail = observer(() => {
  return (
    <>
      <Row gap={3}>
        <Row gap={1}>
          <Label label="Деталь" />
          <P>{writeoffStore.throughDetail.detail?.name}</P>
        </Row>
        <FullscreenDialog
          openButton={<WriteoffOpenListButton />}
          open={writeoffStore.throughDetail.dialogOpen}
          setOpen={v => writeoffStore.throughDetail.setDialogOpen(v)}
        >
          <DetailSelectWindow
            refreshTrigger={writeoffStore.throughDetail.detail?.id}
            detailProps={{
              onRowClick: detail => {
                writeoffStore.throughDetail.setDetail(detail)
                writeoffStore.throughDetail.setDialogOpen(false)
              },
              highlight: detail =>
                detail.id == writeoffStore.throughDetail.detail?.id,
              highlightColor: '#97c3f098'
            }}
          />
        </FullscreenDialog>
      </Row>
      <Inp
        label="Кол-во деталей"
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
