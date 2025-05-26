import {
  Box,
  FormControl,
  FormLabel,
  Select as MuiSelect,
  Option
} from '@mui/joy'

export function Select(props: {
  value?: any
  defaultValue?: any
  label?: string
  placeholder?: string
  selectElements: Array<{ name: string; value: any }>
  onChange: (value: any) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Box>
      <FormControl sx={{ width: 'min-content', minWidth: '207px' }}>
        {props.label && (
          <FormLabel sx={{ margin: 0, padding: 0 }}>{props.label}</FormLabel>
        )}
        <MuiSelect
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
