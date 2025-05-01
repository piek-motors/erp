import { EnWriteoffType } from 'shared/enumerations'
import { QtyInputWithUnit } from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { t } from '../text'
import { useWriteOffStore } from './state'

export function WriteOffThroughMaterial() {
  const state = useWriteOffStore()
  const { material } = state
  return (
    <>
      <MaterialSelect
        setMaterial={m => {
          state.setType(EnWriteoffType.DirectUnit)
          state.setMaterial(m)
        }}
        material={material}
      />
      <QtyInputWithUnit
        label={t.Qty}
        setValue={v => state.setQty(Number(v))}
        unitId={material?.unitId}
        value={state.qty.toString()}
      />
    </>
  )
}
