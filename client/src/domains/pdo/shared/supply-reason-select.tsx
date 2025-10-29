import { observer } from 'mobx-react-lite'
import { SupplyReason, UiSupplyReason, uiSupplyReason } from 'models'
import { ReasonSelect } from './reason-select'

interface Props {
  reason: SupplyReason
  setReason: (reason: SupplyReason) => void
}

export const SupplyReasonSelect = observer((props: Props) => {
  return (
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
  )
})
