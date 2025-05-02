import { Stack } from '@mui/material'
import { PipeShapeData } from 'shared'
import { EnMaterialShape } from 'shared/enumerations'
import { Input } from 'src/shortcuts'
import { AlloyAutocomplete } from '../../shared/alloy-autocomplete'
import { t } from '../../text'
import { useMaterialStore } from '../state'

export function PipeShapeForm() {
  const state = useMaterialStore()
  const handleChange = (field: string) => (value: string) => {
    state.setShape(EnMaterialShape.Circle)
    state.updateShapeDataProperty(field, value)
  }

  const d = state.shapeData as any as PipeShapeData
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
        label={t.Thickness}
        value={d.thickness}
        type="number"
        onChange={e => handleChange('thickness')(e.target.value)}
      />
    </Stack>
  )
}
