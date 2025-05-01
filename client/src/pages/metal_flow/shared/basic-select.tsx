import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
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
      <InputLabel>{props.label}</InputLabel>
      <Select
        disabled={props.disabled}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={e => {
          props.onChange(Number(e.target.value) as EnUnit)
        }}
        label={props.label}
      >
        {props.selectElements.map(unit => (
          <MenuItem key={unit.name} value={unit.value}>
            {unit.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
