/** @jsxImportSource @emotion/react */
import { Autocomplete, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { uiWriteoffReason, UiWriteoffReason } from 'domain-model'
import { observer } from 'lib/deps'
import { Inp, Label, P, Row, SendMutation } from 'lib/index'
import { t } from '../../text'
import { writeoffStore } from '../../writeoffs/writeoff.store'
import { detailStore as store } from '../detail.store'

export const DetailWriteoffPage = observer(() => {
  const creationForrbidden = writeoffStore.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {writeoffStore.validate()?.message}
        </P>
      )
    }
  }
  return (
    <Stack p={0} px={2}>
      <Stack gap={2} py={2}>
        <PageTitle subTitle={t.WriteOffAdd} hideIcon />
        <WriteoffThroughDetail />
        <WriteoffReasonSelect />
        <SendMutation
          disabled={creationForrbidden}
          onClick={async () => {
            return await writeoffStore.insert()
          }}
        />
        {error()}
      </Stack>
    </Stack>
  )
})

const WriteoffReasonSelect = observer(() => {
  return (
    <Stack gap={1}>
      <Label label="Причина списания" />
      <Autocomplete
        options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
          label: v,
          value: k
        }))}
        value={{
          label: uiWriteoffReason(writeoffStore.reason),
          value: writeoffStore.reason?.toString() || '0'
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={option => option.label}
        onChange={(_, newValue) =>
          writeoffStore.setReason(Number(newValue?.value || 0))
        }
      />
    </Stack>
  )
})

const WriteoffThroughDetail = observer(() => {
  return (
    <>
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
      {/* {store.detail && <TotalCost detail={store.detail} qty={store.qty} />} */}
    </>
  )
})
