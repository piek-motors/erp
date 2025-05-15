import { Autocomplete, FormControl, FormLabel } from '@mui/joy'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { map } from '../mappers'
import { Material } from '../../../../../domain-model/dist'

export function MaterialAutocomplete(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material
  onChange: (m: Material) => void
}) {
  const { data, value, onChange } = props

  const options =
    data?.metal_pdo_materials.map(map.material.fromDto).map(material => ({
      label: material.getIdentifier(),
      material
    })) || []

  return (
    <Autocomplete
      onChange={(e: any, selected) => {
        if (selected) {
          onChange(selected.material)
        }
      }}
      options={options}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) =>
        option.material.id === value.material.id
      }
      value={
        value
          ? {
              label: value.getIdentifier(),
              material: value
            }
          : null
      }
    />
  )
}

export function MaterialAutocompleteMulti(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material[]
  onChange: (m: Material[]) => void
  disabledInput?: boolean
}) {
  const { data, value, onChange } = props
  const options =
    data?.metal_pdo_materials.map(map.material.fromDto).map(material => ({
      label: material.getIdentifier(),
      material
    })) || []

  return (
    <FormControl>
      <FormLabel sx={{ m: 0 }}>Выберите материалы</FormLabel>
      <Autocomplete
        multiple
        disabled={props.disabledInput}
        onChange={(e: any, selected) => {
          if (selected) {
            onChange(selected.map(e => e.material))
          }
        }}
        value={value?.map(m => ({
          label: m.getIdentifier(),
          material: m
        }))}
        options={options}
        getOptionLabel={option => option.label}
        isOptionEqualToValue={(option, value) =>
          option.material.id === value.material.id
        }
      />
    </FormControl>
  )
}
