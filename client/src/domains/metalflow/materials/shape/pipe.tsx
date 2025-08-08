import { t } from 'domains/metalflow/text'
import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { material } from '../material.store'

export const PipeMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        value={material.pipe.diameter}
        onChange={v => {
          material.pipe.setDiameter(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <Inp
        label={'Толщина стенки'}
        value={material.pipe.thickness}
        onChange={v => {
          material.pipe.setThickness(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
