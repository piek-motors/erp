import type { InputProps } from '@mui/joy'
import { type Unit, uiUnit } from 'models'
import { InputLabled, Label } from '@/lib/index'

export const QtyInputWithUnit = (props: {
  unit: Unit | null
  autoFocus?: boolean
  value?: string
  setValue: (num: string) => void
  label?: string
  placeholder?: string
  size?: InputProps['size']
  sx?: InputProps['sx']
}) => {
  const { unit, value: qty, setValue: setQty } = props
  return (
    <InputLabled
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
      endDecorator={<Label color="primary">{uiUnit(unit)}</Label>}
    />
  )
}
