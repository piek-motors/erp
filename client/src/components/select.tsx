import { Box, FormControl, Select as MuiSelect, Option } from '@mui/joy'
import { Label } from 'lib/index'

type Props = {
  value?: any
  defaultValue?: any
  label?: string
  placeholder?: string
  options: Array<{
    name: string
    value: any
  }>
  onChange: (value: any) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  width?: string
}

export function Select(props: Props) {
  return (
    <Box sx={{ width: props.width }}>
      <FormControl sx={{ width: 'min-content' }}>
        <Label label={props.label} />
        <MuiSelect
          sx={{ width: props.width }}
          size={props.size ?? 'sm'}
          placeholder={props.placeholder}
          disabled={props.disabled}
          value={props.value?.toString()}
          onChange={(_, v) => {
            props.onChange(v)
          }}
        >
          {props.options.map(unit => (
            <Option key={unit.value} value={unit.value?.toString()}>
              {unit.name}
            </Option>
          ))}
        </MuiSelect>
      </FormControl>
    </Box>
  )
}

type TsEnum = Record<string, number | string>

type EnumSelectProps<E extends TsEnum> = Omit<Props, 'options' | 'onChange'> & {
  enum: E
  value?: number
  onChange: (value: number) => void
  labels?: Partial<Record<E[keyof E], string>>
}

export function EnumSelect<E extends TsEnum>(props: EnumSelectProps<E>) {
  const { enum: enumObj, value, onChange, labels, ...rest } = props

  const options = Object.values(enumObj)
    .filter(v => typeof v === 'number')
    .map(v => ({
      value: v,
      name: labels?.[v] ?? String(v),
    }))

  return (
    <Select
      width="min-content"
      {...rest}
      options={options}
      value={value}
      onChange={v => onChange(+v)}
    />
  )
}
