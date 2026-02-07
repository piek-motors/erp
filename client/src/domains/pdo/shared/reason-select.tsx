import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import {
  SupplyReason,
  UiSupplyReason,
  UiWriteoffReason,
  uiSupplyReason,
  uiWriteoffReason,
  WriteoffReason,
} from 'models'
import { Label } from '@/lib/index'

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
        value: props.reason?.toString() || '0',
      }}
      onChange={newValue => props.setReason(Number(newValue || 0))}
    />
  ),
)

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
      value: props.reason?.toString() || '0',
    }}
    onChange={newValue => props.setReason(Number(newValue || 0))}
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
  onChange: (value: string | null) => void
}

const ReasonSelect = observer((props: ReasonSelectProps) => (
  <Stack py={0.5}>
    <Label label={props.label} />
    <ToggleButtonGroup
      size="sm"
      color="primary"
      variant="soft"
      value={props.value.value}
      onChange={(_, v) => props.onChange(v)}
      sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
    >
      {Object.entries(props.enum)
        .filter(([k, v]) => !Number.isNaN(Number(k)))
        .map(([k, v]) => ({
          label: props.enumTranslationEnum[k],
          value: k,
        }))
        .map(option => (
          <Button value={option.value}>{option.label}</Button>
        ))}
    </ToggleButtonGroup>
  </Stack>
))
