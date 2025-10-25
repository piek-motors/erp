import { Inp } from 'lib/index'

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
    <Inp
      sx={{ width: props.width ? `${props.width}px` : '120px' }}
      type="number"
      {...props}
      value={props.value == null ? '' : props.value}
      onChange={v => {
        const num = Number(v)
        if (isNaN(num)) return
        props.onChange(num)
      }}
      unit={props.unit}
    />
  )
}
