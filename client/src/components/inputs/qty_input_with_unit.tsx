import type { InputProps } from '@mui/joy'
import { InputLabled, Label } from 'lib/index'
import { uiUnit } from 'models'

export const QtyInputWithUnit = (props: {
  unitId?: number
  autoFocus?: boolean
  value?: string
  setValue: (num: string) => void
  label?: string
  placeholder?: string
  size?: InputProps['size']
  sx?: InputProps['sx']
}) => {
  const { unitId, value: qty, setValue: setQty } = props
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
      endDecorator={<Label color="primary">{uiUnit(unitId)}</Label>}
    />
  )
}
