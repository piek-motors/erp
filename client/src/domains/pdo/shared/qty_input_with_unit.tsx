import { InputProps } from '@mui/joy'
import { Inp, Label } from 'lib/index'
import { uiUnit } from 'models'

export const QtyInputWithUnit = (props: {
  unitId?: number
  autoFocus?: boolean
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
    <Inp
      autoFocus={props.autoFocus}
      label={props.label}
      placeholder={props.placeholder}
      value={qty}
      onChange={v => {
        setQty(v)
      }}
      size={props.size}
      type="number"
      sx={{ maxWidth: 150, ...props.sx }}
      endDecorator={<Label color="primary">{uiUnit(unitId)}</Label>}
    />
  )
}
