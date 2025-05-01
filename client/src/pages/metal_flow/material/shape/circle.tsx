import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { CircleShapeData } from 'shared'
import { EnMaterialShape } from 'shared/enumerations'
import { Input } from 'src/shortcuts'
import { AlloyAutocomplete } from '../../shared/alloy-autocomplete'
import { t } from '../../text'
import { useMaterialStore } from '../state'

export function CircleShapeForm() {
  const state = useMaterialStore()
  const handleChange = (field: string) => (value: string) => {
    state.setShape(EnMaterialShape.Circle)
    state.setShapeData({
      ...state.shapeData,
      [field]: value
    })
  }

  const d = state.shapeData as any as CircleShapeData
  return (
    <Stack>
      <Input
        label={t.Diameter}
        type="number"
        value={d.diameter || ''}
        onChange={e => handleChange('diameter')(e.target.value)}
      />
      <AlloyAutocomplete
        setAlloy={alloy => handleChange('alloy')(alloy)}
        alloy={d.alloy}
      />
      <Input
        label={t.LinearMass}
        value={d.linearMass || ''}
        type="number"
        onChange={e => handleChange('linearMass')(e.target.value)}
      />
      <Input
        label={t.Density}
        value={d.density || ''}
        type="number"
        onChange={e => handleChange('density')(e.target.value)}
      />
      <ToggleButtonGroup
        value={d.calibrated}
        exclusive
        onChange={(e, v) => handleChange('calibrated')(v)}
      >
        <ToggleButton value={false}>{t.NotCalibrated}</ToggleButton>
        <ToggleButton value={true}>{t.Calibrated}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}
