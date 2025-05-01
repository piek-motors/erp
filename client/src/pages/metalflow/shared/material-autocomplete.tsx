import { Autocomplete, TextField } from '@mui/material'
import { useGetMaterialsQuery } from '../../../types/graphql-shema'
import { Material } from '../domain/material'
import { t } from '../text'

export function MaterialAutocomplete(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
  value?: Material
  onChange: (m: Material) => void
}) {
  const { data, value, onChange } = props

  const options =
    data?.metal_pdo_materials.map(Material.fromDto).map(material => ({
      label: material.getIdentifier(),
      material
    })) || []

  return (
    <Autocomplete
      disablePortal
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
      renderInput={params => <TextField {...params} label={t.Material} />}
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
    data?.metal_pdo_materials.map(Material.fromDto).map(material => ({
      label: material.getIdentifier(),
      material
    })) || []

  return (
    <Autocomplete
      multiple
      disabled={props.disabledInput}
      disablePortal
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
      renderInput={params => <TextField {...params} label={t.Material} />}
    />
  )
}
