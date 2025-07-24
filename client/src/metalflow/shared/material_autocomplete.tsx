import { InputProps } from '@mui/joy'
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
