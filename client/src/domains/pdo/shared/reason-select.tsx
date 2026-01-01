import { Autocomplete, Stack } from '@mui/joy'
import { Label } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { UiWriteoffReason, uiWriteoffReason, WriteoffReason } from 'models'

interface WriteoffReasonSelectProps {
  reason: WriteoffReason
  setReason: (reason: WriteoffReason) => void
}

export const WriteoffReasonSelect = observer(
  (props: WriteoffReasonSelectProps) => (
    <ReasonSelect
      label={'Тип списания'}
      enum={WriteoffReason}
      enumTranslationEnum={UiWriteoffReason}
      value={{
        label: uiWriteoffReason(props.reason),
        value: props.reason?.toString() || '0'
      }}
      onChange={newValue => props.setReason(Number(newValue?.value || 0))}
    />
  )
)

import { SupplyReason, UiSupplyReason, uiSupplyReason } from 'models'

interface Props {
  reason: SupplyReason
  setReason: (reason: SupplyReason) => void
}

export const SupplyReasonSelect = observer((props: Props) => (
  <ReasonSelect
    label={'Тип поставки'}
    enum={SupplyReason}
    enumTranslationEnum={UiSupplyReason}
    value={{
      label: uiSupplyReason(props.reason),
      value: props.reason?.toString() || '0'
    }}
    onChange={newValue => props.setReason(Number(newValue?.value || 0))}
  />
))

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

const ReasonSelect = observer((props: ReasonSelectProps) => (
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
