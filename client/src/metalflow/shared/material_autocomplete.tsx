import { FormControl, InputProps } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { MaterialCost } from '../details/detail.store'

export function MaterialAutocomplete(props: {
  data?: MaterialCost[]
  value?: MaterialCost | null
  onChange: (m: MaterialCost) => void
  size?: InputProps['size']
}) {
  const { data, value, onChange } = props
  const options: BaseOption[] =
    data?.map(material => ({
      label: material.materialLabel,
      value: material
    })) || []
  return (
    <BaseAutocomplete
      size={props.size}
      sx={{ minWidth: '400px' }}
      options={options}
      value={value ? { label: value.materialLabel, value: value } : null}
      onChange={newValue => {
        if (newValue && !Array.isArray(newValue)) {
          onChange(newValue.value)
        }
      }}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.label
      }
      isOptionEqualToValue={(option, value) =>
        option.value.id === value.value.id
      }
    />
  )
}

export function MaterialAutocompleteMulti(props: {
  data?: MaterialCost[]
  value?: MaterialCost[]
  onChange: (m: MaterialCost[]) => void
  disabledInput?: boolean
}) {
  return (
    <FormControl>
      <BaseAutocomplete
        label="Изговлена из материалов"
        multiple
        options={
          props.data?.map(material => ({
            label: material.materialLabel,
            value: material
          })) || []
        }
        value={
          props.value?.map(m => ({ label: m.materialLabel, value: m })) || []
        }
        onChange={newValue => {
          if (Array.isArray(newValue)) {
            props.onChange(newValue.map(v => v.value))
          } else throw new Error('Invalid value')
        }}
        disabled={props.disabledInput}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.label
        }
        isOptionEqualToValue={(option, value) => {
          return option.value.materialId === value.value.materialId
        }}
      />
    </FormControl>
  )
}
