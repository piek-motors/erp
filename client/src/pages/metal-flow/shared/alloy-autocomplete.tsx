import { Autocomplete, createFilterOptions, FormLabel } from '@mui/joy'
import { ErrorHint } from 'shortcuts'
import { useGetPossibleAlloysQuery } from 'types/graphql-shema'
import { t } from '../text'

const filter = createFilterOptions<{ inputValue: string; title: string }>()

export function AlloyAutocomplete(props: {
  setAlloy: (alloy: string) => void
  alloy?: string
}) {
  const { setAlloy, alloy } = props
  const { data, loading, error } = useGetPossibleAlloysQuery()

  const options =
    Array.from(new Set(data?.metal_flow_materials?.map(e => e.shape_data))) ||
    []

  return (
    <>
      <ErrorHint e={error} />
      <FormLabel>{t.Alloy}</FormLabel>
      <Autocomplete
        freeSolo
        loading={loading}
        onChange={(e, newValue) => {
          if (typeof newValue === 'string') {
            setAlloy(newValue)
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setAlloy(newValue.inputValue)
          } else {
            setAlloy(newValue)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)

          const { inputValue } = params
          // Suggest the creation of a new value
          const isExisting = options.some(option => inputValue === option)
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `${t.Add}: ${inputValue}`
            })
          }

          return filtered
        }}
        getOptionLabel={option => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option
          }
          // Add "xxx" option created dynamically
          if (option?.inputValue) {
            return option?.title
          }
          // Regular option
          return option?.title
        }}
        options={options}
        value={alloy}
      />
    </>
  )
}
