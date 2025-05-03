import { FormControl, Option, Select } from '@mui/joy'
import { EnUnit } from 'shared/enumerations'

export function MySelect(props: {
  value?: any
  defaultValue?: any
  label: string
  selectElements: Array<{ name: string; value: any }>
  onChange: (unitId: EnUnit) => void
  disabled?: boolean
}) {
  return (
    <FormControl>
      <Select
        placeholder={props.label}
        disabled={props.disabled}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={(e, v) => {
          props.onChange(Number(v) as EnUnit)
        }}
      >
        {props.selectElements.map(unit => (
          <Option value={unit.value}>{unit.name}</Option>
        ))}
      </Select>
    </FormControl>
  )
}
