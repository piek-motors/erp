import { Autocomplete } from '@mui/joy'
import { Material } from 'shared/domain'
import { useGetMaterialsQuery } from '../../../types/graphql-shema'
import { map } from '../domain-adapter'

export function MaterialAutocomplete(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material
  onChange: (m: Material) => void
}) {
  const { data, value, onChange } = props

  const options =
    data?.metal_pdo_materials.map(map.material.fromDto).map(material => ({
      label: material.getTextId(),
      material
    })) || []

  return (
    <Autocomplete
      // disablePortal
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
              label: value.getTextId(),
              material: value
            }
          : null
      }
      // renderInput={params => <TextField {...params} label={t.Material} />}
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
      label: material.getTextId(),
      material
    })) || []

  return (
    <Autocomplete
      multiple
      disabled={props.disabledInput}
      onChange={(e: any, selected) => {
        if (selected) {
          onChange(selected.map(e => e.material))
        }
      }}
      value={value?.map(m => ({
        label: m.getTextId(),
        material: m
      }))}
      options={options}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) =>
        option.material.id === value.material.id
      }
    />
  )
}
