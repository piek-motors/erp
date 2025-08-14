import { t } from 'domains/metalflow/text'
import { observer } from 'lib/deps'
import { Inp, InputStack } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const HexagonBarMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        unit={uiUnit(EnUnit.MilliMeter)}
        value={api.s.hexagon.diameter}
        onChange={v => {
          api.s.hexagon.setDiameter(v)
        }}
      />
    </InputStack>
  )
})
