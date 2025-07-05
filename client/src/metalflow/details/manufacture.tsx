import { Stack } from '@mui/joy'
import { observer } from 'lib/deps'
import { P, SendMutation } from 'lib/index'
import { QtyInputWithUnit } from 'metalflow/shared'
import { Detail } from './detail.store'
import { detailManufactureStore as store } from './manufacture.store'

export const DetailManufacture = observer((props: { detail: Detail }) => {
  if (props.detail.usedMaterials.length === 0) {
    return <P>Нет материалов</P>
  }

  return (
    <Stack>
      <QtyInputWithUnit
        label="Кол-во"
        setValue={v => {
          store.setQty(Number(v))
        }}
      />
      <SendMutation
        onClick={async () => {
          return await store.save()
        }}
      />
    </Stack>
  )
})
