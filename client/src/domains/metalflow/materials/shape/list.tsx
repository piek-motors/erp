import { t } from 'domains/metalflow/text'
import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { material } from '../store'

export const ListMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Thickness}
        value={material.list.thickness}
        onChange={v => {
          material.list.setThickness(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
