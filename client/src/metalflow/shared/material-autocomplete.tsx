import { FormControl } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { Material } from 'domain-model'
import { useGetMaterialsQuery } from 'lib/types/graphql-shema'
import { MaterialCost } from 'metalflow/detail/store/detail.store'
import { map } from '../mappers'

export function MaterialAutocomplete(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material | null
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
