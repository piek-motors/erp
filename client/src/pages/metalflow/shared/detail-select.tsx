import { Autocomplete, TextField } from '@mui/material'
import { Detail } from 'shared/domain'
import { useGetDetailsQuery } from '../../../types/graphql-shema'
import { map } from '../domain-adapter'
import { t } from '../text'

export function DetailSelect(props: {
  value?: Detail
  onChange: (value: Detail) => void
}) {
  const details = useGetDetailsQuery()
  const options =
    details.data?.metal_pdo_details.map(each => ({
      label: each.name,
      data: map.detail.fromDto(each)
    })) || []

  return (
    <Autocomplete
      disablePortal
      onChange={(_, selected) => {
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
