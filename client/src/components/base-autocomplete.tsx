import { Autocomplete, AutocompleteProps, Box } from '@mui/joy'
import type { ReactNode } from 'react'
import { Label } from '@/lib/index'

export interface BaseOption {
  label: string
  value: any
  inputValue?: string
}

interface BaseAutocompleteProps<T extends BaseOption>
  extends Omit<
    AutocompleteProps<T, boolean, boolean, boolean>,
    'onChange' | 'renderInput'
  > {
  label?: string
  errorMessage?: ReactNode // renamed from error
  width?: string | number
  createOptionLabel?: (inputValue: string) => string
  onChange: (value: T | null) => void
}

export function BaseAutocomplete<T extends BaseOption>({
  label,
  errorMessage,
  width = 'max-content',
  createOptionLabel = inputValue => `+ ${inputValue}`,
  onChange,
  freeSolo = false,
  ...restProps
}: BaseAutocompleteProps<T>) {
  const filter = (options: T[], params: any) => {
    const filtered = options
    if (!freeSolo) return filtered

    const inputValue = params.inputValue
    const isExisting = options.some(o => o.label === inputValue)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        label: createOptionLabel(inputValue),
        value: inputValue,
        inputValue,
      } as T)
    }

    return filtered
  }

  const handleChange: AutocompleteProps<
    T,
    boolean,
    boolean,
    boolean
  >['onChange'] = (_, newValue) => {
    if (freeSolo && typeof newValue === 'string') {
      onChange({ label: newValue, value: newValue } as T)
    } else if (
      newValue &&
      typeof newValue === 'object' &&
      'inputValue' in newValue
    ) {
      onChange({
        label: createOptionLabel(newValue.inputValue || ''),
        value: newValue.inputValue,
      } as T)
    } else {
      onChange(newValue as T)
    }
  }

  return (
    <Box width={width}>
      {label && <Label label={label} />}
      {errorMessage}
      <Autocomplete
        size="sm"
        {...restProps}
        filterOptions={filter}
        onChange={handleChange}
      />
    </Box>
  )
}
