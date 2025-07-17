/** @jsxImportSource @emotion/react */
import { InModal } from 'components/modal'
import { uiWriteoffReason, UiWriteoffReason } from 'domain-model'
import { observer } from 'lib/deps'
import { Btn, P, useState } from 'lib/index'
import { t } from '../../../text'
import { material } from '../../material.store'
import { MaterialOperationLayout } from '../shared/material-operation-layout'
import { ReasonSelect } from '../shared/reason-select'

export const MaterialWriteoff = observer(() => {
  const creationForrbidden = material.writeoff.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {material.writeoff.validate()?.message}
        </P>
      )
    }
  }

  const writeoffReasonComponent = (
    <ReasonSelect
      label="Причина списания"
      options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
        label: v,
        value: k
      }))}
      value={{
        label: uiWriteoffReason(material.writeoff.reason),
        value: material.writeoff.reason?.toString() || '0'
      }}
      onChange={newValue =>
        material.writeoff.setReason(Number(newValue?.value || 0))
      }
    />
  )

  return (
    <MaterialOperationLayout
      title={t.WriteOffAdd}
      materialLabel={material.label}
      materialUnit={material.unit}
      lengthValue={material.writeoff.length}
      lengthSetValue={value => material.writeoff.setLength(value)}
      reasonComponent={writeoffReasonComponent}
      submitDisabled={material.writeoff.disabled()}
      onSubmit={() => material.insertWriteoff()}
      error={error()}
    />
  )
})

export const WriteoffModal = observer(() => {
  const [open, setOpen] = useState(false)
  return (
    <InModal
      openButton={
        <Btn variant="soft" color="danger">
          Списать
        </Btn>
      }
      open={open}
      setOpen={setOpen}
    >
      <MaterialWriteoff />
    </InModal>
  )
})
