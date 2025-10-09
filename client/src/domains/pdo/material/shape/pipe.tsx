import { t } from 'domains/pdo/text'
import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const PipeMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        value={api.s.pipe.diameter}
        onChange={v => {
          api.s.pipe.setDiameter(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <Inp
        label={'Толщина стенки'}
        value={api.s.pipe.thickness}
        onChange={v => {
          api.s.pipe.setThickness(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
