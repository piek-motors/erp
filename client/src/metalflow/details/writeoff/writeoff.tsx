/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import {
  UiWriteoffReason,
  uiWriteoffReason
} from 'domain-model/dist/domain/metal-flow/ui.translators'
import { observer } from 'lib/deps'
import { Inp, Label, P, Row, SendMutation } from 'lib/index'
import { ReasonSelect } from 'metalflow/materials/operations/shared/reason-select'
import { MetalPageTitle } from 'metalflow/shared/basic'
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
        <ReasonSelect
          label="Причина списания"
          options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
            label: v,
            value: k
          }))}
          value={{
            label: uiWriteoffReason(detailStore.writeoff.reason),
            value: detailStore.writeoff.reason?.toString() || '0'
          }}
          onChange={newValue =>
            detailStore.writeoff.setReason(Number(newValue?.value || 0))
          }
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
