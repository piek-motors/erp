import { InputProps, Stack } from '@mui/joy'
import { uiUnit } from 'domain-model'
import { Inp, P } from 'lib/index'

export const QtyInputWithUnit = (props: {
  unitId?: number
  value?: string
  defaultValue?: string
  setValue: (num: string) => void
  label?: string
  placeholder?: string
  size?: InputProps['size']
  sx?: InputProps['sx']
}) => {
  const { unitId, value: qty, setValue: setQty } = props
  return (
    <Stack
      direction="row"
      alignItems="end"
      gap={1}
      sx={{ width: 'min-content' }}
    >
      <Inp
        label={props.label}
        placeholder={props.placeholder}
        value={qty}
        onChange={v => {
          setQty(v)
        }}
        size={props.size}
        type="number"
        sx={{ maxWidth: 100, ...props.sx }}
      />
      <P pb={1}>{uiUnit(unitId)}</P>
    </Stack>
  )
}
