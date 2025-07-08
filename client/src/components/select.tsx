import { Box, FormControl, Select as MuiSelect, Option } from '@mui/joy'
import { Label } from 'lib/index'

export function Select(props: {
  value?: any
  defaultValue?: any
  label?: string
  placeholder?: string
  selectElements: Array<{ name: string; value: any }>
  onChange: (value: any) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  width?: string
}) {
  return (
    <Box sx={{ width: props.width }}>
      <FormControl sx={{ width: 'min-content', minWidth: '207px' }}>
        <Label label={props.label} />
        <MuiSelect
          sx={{ width: props.width }}
          size={props.size}
          placeholder={props.placeholder}
          disabled={props.disabled}
          value={props.value?.toString()}
          onChange={(_, v) => {
            props.onChange(v)
          }}
        >
          {props.selectElements.map(unit => (
            <Option key={unit.value} value={unit.value?.toString()}>
              {unit.name}
            </Option>
          ))}
        </MuiSelect>
      </FormControl>
    </Box>
  )
}
