/** @jsxImportSource @emotion/react */
import { FullscreenDialog } from 'components/fullscreen.dialog'
import { EnWriteoffType } from 'domain-model'
import { observer } from 'lib/deps'
import { Inp, Label, P, Row } from 'lib/index'
import { DetailSelectWindow } from 'metalflow/detail/detail_list'
import { WriteoffOpenListButton } from '../writeoff.shared'
import { writeoffStore as store } from '../writeoff.store'

export const WriteoffThroughDetail = observer(() => {
  return (
    <>
      <Row gap={3}>
        <Row gap={1}>
          <Label label="Деталь" />
          <P>{store.throughDetail.detail?.name}</P>
        </Row>
        <FullscreenDialog
          openButton={<WriteoffOpenListButton />}
          open={store.throughDetail.dialogOpen}
          setOpen={v => store.throughDetail.setDialogOpen(v)}
        >
          <DetailSelectWindow
            refreshTrigger={store.throughDetail.detail?.id}
            detailProps={{
              onRowClick: detail => {
                store.setType(EnWriteoffType.ThroughDetail)
                store.throughDetail.setDetail(detail)
                store.throughDetail.setDialogOpen(false)
              },
              highlight: detail => detail.id == store.throughDetail.detail?.id,
              highlightColor: '#97c3f098'
            }}
          />
        </FullscreenDialog>
      </Row>
      <Inp
        label="Кол-во деталей"
        type="number"
        value={store.throughDetail.qty || ''}
        onChange={v => {
          store.throughDetail.setQty(v)
        }}
      />
      {/* {store.detail && <TotalCost detail={store.detail} qty={store.qty} />} */}
    </>
  )
})
