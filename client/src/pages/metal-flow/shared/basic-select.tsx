import { FormControl, FormLabel, Option, Select } from '@mui/joy'
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
      <FormLabel sx={{ margin: 0, padding: 0 }}>{props.label}</FormLabel>
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
