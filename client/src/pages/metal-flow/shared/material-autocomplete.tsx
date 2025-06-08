import { FormControl } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { Material } from 'domain-model'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { map } from '../mappers'

export function MaterialAutocomplete(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material
  onChange: (m: Material) => void
}) {
  const { data, value, onChange } = props

  const options: BaseOption[] =
    data?.metal_flow_materials.map(map.material.fromDto).map(material => ({
      label: material.deriveLabel(),
      value: material
    })) || []

  return (
    <BaseAutocomplete
      sx={{ minWidth: '400px' }}
      options={options}
      value={value ? { label: value.deriveLabel(), value: value } : null}
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
  data?: Material[]
  value?: Material[]
  onChange: (m: Material[]) => void
  disabledInput?: boolean
}) {
  const { data, value, onChange } = props
  const options: BaseOption[] =
    data?.map(material => ({
      label: material.deriveLabel(),
      value: material
    })) || []

  return (
    <FormControl>
      <BaseAutocomplete
        label="Изговлена из материалов"
        multiple
        options={options}
        value={value?.map(m => ({ label: m.label, value: m })) || []}
        onChange={newValue => {
          if (Array.isArray(newValue)) {
            onChange(newValue.map(v => v.value))
          } else throw new Error('Invalid value')
        }}
        disabled={props.disabledInput}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.label
        }
        isOptionEqualToValue={(option, value) => {
          return option.value.id === value.value.id
        }}
      />
    </FormControl>
  )
}
