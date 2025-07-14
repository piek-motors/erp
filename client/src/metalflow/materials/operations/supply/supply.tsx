/** @jsxImportSource @emotion/react */
import { InModal } from 'components/modal'
import { EnSupplyReason, uiSupplyReason, UiSupplyReason } from 'domain-model'
import { Btn, P, useState } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { material } from '../../material.state'
import { MaterialOperationLayout } from '../shared/material-operation-layout'
import { ReasonSelect } from '../shared/reason-select'

export const MaterialSupplyPage = observer(() => {
  if (!material.material?.id) {
    return <P>Материал не выбран</P>
  }

  const supplyReasonComponent = (
    <ReasonSelect
      label="Причина"
      options={Object.entries(UiSupplyReason)
        .map(([k, v]) => ({
          label: v,
          value: k
        }))
        .filter(e => e.value !== EnSupplyReason.InternalProduction.toString())}
      value={{
        label: uiSupplyReason(material.supply.reason),
        value: material.supply.reason?.toString() || '0'
      }}
      onChange={newValue =>
        material.supply.setReason(Number(newValue?.value || 0))
      }
    />
  )

  return (
    <MaterialOperationLayout
      title="Поставка"
      materialLabel={material.material?.label}
      materialUnit={material.material?.unit}
      lengthValue={material.supply.length}
      lengthSetValue={value => material.supply.setLength(value)}
      reasonComponent={supplyReasonComponent}
      submitDisabled={material.supply.disabled()}
      onSubmit={() => material.insertSupply()}
    />
  )
})

export const SupplyModal = observer(() => {
  const [open, setOpen] = useState(false)
  return (
    <InModal
      openButton={
        <Btn variant="soft" color="success">
          Поставка
        </Btn>
      }
      open={open}
      setOpen={setOpen}
    >
      <MaterialSupplyPage />
    </InModal>
  )
})
