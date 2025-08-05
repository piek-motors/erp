import { Autocomplete, Stack } from '@mui/joy'
import { Label } from 'lib/index'
import { observer } from 'mobx-react-lite'

interface ReasonOption {
  label: string
  value: string
}

interface ReasonSelectProps {
  label: string
  enum: object
  enumTranslationEnum: object
  value: ReasonOption
  onChange: (value: ReasonOption | null) => void
}

export const ReasonSelect = observer((props: ReasonSelectProps) => (
  <Stack py={0.5}>
    <Label label={props.label} />
    <Autocomplete
      options={Object.entries(props.enum)
        .filter(([k, v]) => !Number.isNaN(Number(k)))
        .map(([k, v]) => ({
          label: props.enumTranslationEnum[k],
          value: k
        }))}
      value={props.value}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={option => option.label}
      onChange={(_, newValue) => props.onChange(newValue)}
    />
  </Stack>
))
