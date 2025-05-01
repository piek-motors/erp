import { Stack } from '@mui/material'
import { EnMaterialShape } from 'shared/enumerations'
import { Input } from 'src/shortcuts'
import { t } from '../../text'
import { useMaterialStore } from '../state'

export function SquareShapeForm() {
  const state = useMaterialStore()

  const handleChange = (field: string) => (value: string) => {
    state.setShape(EnMaterialShape.Square)
    state.setShapeData({
      ...state.shapeData,
      [field]: value
    })
  }

  const d = state.setShapeData as any
  return (
    <Stack>
      <Input
        label={t.Width}
        value={d.width || ''}
        onChange={e => handleChange('width')(e.target.value)}
      />
    </Stack>
  )
}
