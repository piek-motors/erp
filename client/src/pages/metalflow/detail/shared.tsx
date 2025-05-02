import { Stack } from '@mui/material'
import { Material } from 'shared/domain'
import { EnUnit } from 'shared/enumerations'
import { P } from '../../../shortcuts'
import { QtyInputWithUnit } from '../shared'
import { useDetail } from './state'

export function MaterialWeightInput(props: { material: Material }) {
  const { material } = props
  const state = useDetail()

  return (
    <QtyInputWithUnit
      unitId={EnUnit.Gram}
      setValue={v => {
        material.weight = Number(v)
        state.updMaterialById(material.id, material)
      }}
      value={material.weight?.toString() || ''}
      label="Вес заготовки (гр)"
    />
  )
}

export function MatirialLengthInput(props: { material: Material }) {
  const { material } = props
  const state = useDetail()
  return (
    <QtyInputWithUnit
      unitId={EnUnit.MilliMeter}
      setValue={v => {
        material.length = Number(v)
        state.updMaterialById(material.id, material)
      }}
      value={material.length?.toString() || ''}
      label="Длина заготовки (мм)"
    />
  )
}

export function DetailMaterialPropInput() {
  const state = useDetail()
  return (
    <Stack>
      {state.materials.map(m => (
        <Stack sx={{ width: 'max-content' }}>
          <P variant="body1" px={1} pt={1}>
            {m.getIdentifier()}
          </P>
          <MaterialWeightInput material={m} />
          <MatirialLengthInput material={m} />
        </Stack>
      ))}
    </Stack>
  )
}
