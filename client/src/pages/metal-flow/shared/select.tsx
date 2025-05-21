import { FormControl, FormLabel, Option, Select as MuiSelect } from '@mui/joy'
import { EnUnit } from 'domain-model'

export function Select(props: {
  value?: any
  defaultValue?: any
  label?: string
  placeholder?: string
  selectElements: Array<{ name: string; value: any }>
  onChange: (value: any) => void
  disabled?: boolean
}) {
  return (
    <FormControl>
      {props.label && (
        <FormLabel sx={{ margin: 0, padding: 0 }}>{props.label}</FormLabel>
      )}
      <MuiSelect
        placeholder={props.placeholder}
        disabled={props.disabled}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={(_, v) => {
          props.onChange(v)
        }}
      >
        {props.selectElements.map(unit => (
          <Option key={unit.value} value={unit.value}>
            {unit.name}
          </Option>
        ))}
      </MuiSelect>
    </FormControl>
  )
}
