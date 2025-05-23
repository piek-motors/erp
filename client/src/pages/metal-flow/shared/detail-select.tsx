import { Autocomplete } from '@mui/joy'
import { useGetDetailsQuery } from 'types/graphql-shema'
import { Detail } from '../../../../../domain-model/dist'
import { map } from '../mappers'

export function DetailSelect(props: {
  value?: Detail
  onChange: (value: Detail) => void
}) {
  const details = useGetDetailsQuery()
  const options =
    details.data?.metal_flow_details.map(each => ({
      label: each.name,
      data: map.detail.fromDto(each)
    })) || []

  return (
    <Autocomplete
      onChange={(_, selected) => {
        if (selected?.data) {
          props.onChange(selected.data)
        }
      }}
      getOptionLabel={option => option.label}
      options={options}
      isOptionEqualToValue={(option, value) =>
        option.data?.id === value.data?.id
      }
    />
  )
}
