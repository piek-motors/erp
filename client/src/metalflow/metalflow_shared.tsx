import { InputProps, Stack } from '@mui/joy'
import { uiUnit } from 'domain-model'
import { Inp, P } from 'lib/index'

export const QtyInputWithUnit = (props: {
  unitId?: number
  value?: string
  defaultValue?: string
  setValue: (num: string) => void
  label: string
  size?: InputProps['size']
}) => {
  const { unitId, value: qty, setValue: setQty } = props
  return (
    <Stack direction="row" alignItems="end" gap={1}>
      <Inp
        label={props.label}
        value={qty}
        onChange={v => {
          setQty(v)
        }}
        size={props.size}
        sx={{ width: 150 }}
        type="number"
      />
      <P pb={1}>{uiUnit(unitId)}</P>
    </Stack>
  )
}
