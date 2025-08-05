import { EnSupplyReason, UiSupplyReason, uiSupplyReason } from 'domain-model'
import { observer } from 'mobx-react-lite'
import { ReasonSelect } from './reason-select'

interface Props {
  reason: EnSupplyReason
  setReason: (reason: EnSupplyReason) => void
}

export const SupplyReasonSelect = observer((props: Props) => {
  return (
    <ReasonSelect
      label={'Тип поставки'}
      enum={EnSupplyReason}
      enumTranslationEnum={UiSupplyReason}
      value={{
        label: uiSupplyReason(props.reason),
        value: props.reason?.toString() || '0'
      }}
      onChange={newValue => props.setReason(Number(newValue?.value || 0))}
    />
  )
})
