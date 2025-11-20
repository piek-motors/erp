import { InputWithUnit } from 'lib/index'

interface Props {
  label?: string
  value?: number | null
  onChange: (v: number) => void
  placeholder?: string
  width?: number
  unit?: string
}

export function NumberInput(props: Props) {
  return (
    <InputWithUnit
      sx={{ width: props.width ? `${props.width}px` : '120px' }}
      type="number"
      {...props}
      value={props.value == null ? '' : props.value}
      onChange={e => {
        const num = Number(e.target.value)
        if (Number.isNaN(num)) {
          return
        }
        props.onChange(num)
      }}
      unit={props.unit}
    />
  )
}
