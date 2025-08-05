import {
  EnWriteoffReason,
  UiWriteoffReason,
  uiWriteoffReason
} from 'domain-model'
import { observer } from 'mobx-react-lite'
import { ReasonSelect } from './reason-select'

interface WriteoffReasonSelectProps {
  reason: EnWriteoffReason
  setReason: (reason: EnWriteoffReason) => void
}

export const WriteoffReasonSelect = observer(
  (props: WriteoffReasonSelectProps) => (
    <ReasonSelect
      label={'Тип списания'}
      enum={EnWriteoffReason}
      enumTranslationEnum={UiWriteoffReason}
      value={{
        label: uiWriteoffReason(props.reason),
        value: props.reason?.toString() || '0'
      }}
      onChange={newValue => props.setReason(Number(newValue?.value || 0))}
    />
  )
)
