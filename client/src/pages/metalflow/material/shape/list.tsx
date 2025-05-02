import { Stack } from '@mui/material'
import { EnMaterialShape } from 'shared/enumerations'
import { Input } from 'src/shortcuts'
import { t } from '../../text'
import { useMaterialStore } from '../state'

export type ListShapeData = {
  length: string
  width: string
  thickness: string
}

export function ListShapeForm() {
  const state = useMaterialStore()

  const handleChange = (field: string) => (value: string) => {
    state.setShape(EnMaterialShape.List)
    state.updateShapeDataProperty(field, value)
  }

  const d = state.setShapeData as any as ListShapeData
  return (
    <Stack>
      <Input
        label={t.Length}
        value={d.length || ''}
        onChange={e => handleChange('length')(e.target.value)}
      />
      <Input
        label={t.Width}
        value={d.width || ''}
        onChange={e => handleChange('width')(e.target.value)}
      />
      <Input
        label={t.Thickness}
        value={d.thickness || ''}
        onChange={e => handleChange('thickness')(e.target.value)}
      />
    </Stack>
  )
}
