import { Autocomplete, Box, createFilterOptions, FormLabel } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { ReactNode } from 'react'

export interface BaseOption {
  label: string
  value: any
  inputValue?: string
}

interface BaseAutocompleteProps<T extends BaseOption> {
  label?: string
  sx?: SxProps
  options: T[]
  value: T | T[] | null
  onChange: (value: T | null) => void
  multiple?: boolean
  freeSolo?: boolean
  loading?: boolean
  disabled?: boolean
  error?: ReactNode
  width?: string | number
  createOptionLabel?: (inputValue: string) => string
  getOptionLabel?: (option: T | string) => string
  isOptionEqualToValue?: (option: T, value: T) => boolean
}

export function BaseAutocomplete<T extends BaseOption>({
  label,
  sx,
  options,
  value,
  onChange,
  multiple = false,
  freeSolo = false,
  loading = false,
  disabled = false,
  error,
  width = 'max-content',
  createOptionLabel = inputValue => `+ ${inputValue}`,
  getOptionLabel = option =>
    typeof option === 'string' ? option : option.label,
  isOptionEqualToValue = (option, value) => option.value === value.value
}: BaseAutocompleteProps<T>) {
  const filter = createFilterOptions<T>()

  return (
    <Box width={width}>
      {label && <FormLabel>{label}</FormLabel>}
      {error}
      <Autocomplete
        sx={sx}
        multiple={multiple}
        freeSolo={freeSolo}
        loading={loading}
        disabled={disabled}
        options={options}
        value={value}
        onChange={(_, newValue) => {
          if (freeSolo && typeof newValue === 'string') {
            const newOption = { label: newValue, value: newValue } as T
            onChange(newOption)
          } else if (
            newValue &&
            typeof newValue === 'object' &&
            'inputValue' in newValue
          ) {
            const newOption = {
              label: createOptionLabel(newValue.inputValue || ''),
              value: newValue.inputValue
            } as T
            onChange(newOption)
          } else {
            onChange(newValue as T)
          }
        }}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        filterOptions={(options, params) => {
          if (!freeSolo) return filter(options, params)

          const filtered = filter(options, params)
          const { inputValue } = params

          // Suggest creating a new value
          const isExisting = options.some(option => inputValue === option.label)
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              label: createOptionLabel(inputValue),
              value: inputValue,
              inputValue
            } as T)
          }

          return filtered
        }}
      />
    </Box>
  )
}
