/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import { observer } from 'lib/deps'
import { Inp, Label, P, Row, SendMutation } from 'lib/index'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { WriteoffReasonSelect } from 'metalflow/writeoffs/writeoff.shared'
import { t } from '../../text'
import { detailStore, detailStore as store } from '../detail.store'

export const DetailWriteoffPage = observer(() => {
  const creationForrbidden = detailStore.writeoff.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {detailStore.writeoff.validate()?.message}
        </P>
      )
    }
  }
  return (
    <Stack p={1}>
      <Stack gap={2}>
        <MetalPageTitle t={t.WriteOffAdd} />
        <Row gap={3}>
          <Row gap={1}>
            <Label label="Деталь" />
            <P>{store.writeoff.detail?.name}</P>
          </Row>
        </Row>
        <Inp
          label="Кол-во деталей"
          type="number"
          value={store.writeoff.qty || ''}
          onChange={v => {
            store.writeoff.setQty(v)
          }}
        />
        <WriteoffReasonSelect
          reason={detailStore.writeoff.reason}
          setReason={v => detailStore.writeoff.setReason(v)}
        />
        <SendMutation
          disabled={creationForrbidden}
          onClick={async () => {
            return await detailStore.writeoff.save()
          }}
        />
        {error()}
      </Stack>
    </Stack>
  )
})
