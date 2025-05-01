import { Autocomplete, TextField } from '@mui/material'
import { useGetDetailsQuery } from '../../../types/graphql-shema'
import { Detail } from '../domain/detail'
import { Material } from '../domain/material'
import { t } from '../text'

export function DetailSelect(props: {
  value?: Detail
  onChange: (value: Detail) => void
}) {
  const details = useGetDetailsQuery()
  const options =
    details.data?.metal_pdo_details.map(each => ({
      label: each.name,
      data: new Detail(
        each.id,
        each.name,
        each.detail_materials.map(m => {
          return Material.fromDto({
            ...m.material,
            shape_data: m.material.shape_data
          })
        }),
        each.detail_materials.map(m => m.cost)
      )
    })) || []

  return (
    <Autocomplete
      disablePortal
      onChange={(e, selected) => {
        if (selected) {
          props.onChange(selected.data)
        }
      }}
      getOptionLabel={option => option.label}
      options={options}
      isOptionEqualToValue={(option, value) => option.data.id === value.data.id}
      renderInput={params => <TextField {...params} label={t.DetailName} />}
    />
  )
}
