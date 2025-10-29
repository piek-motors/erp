import { observer } from 'mobx-react-lite'
import { UiWriteoffReason, uiWriteoffReason, WriteoffReason } from 'models'
import { ReasonSelect } from './reason-select'

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
