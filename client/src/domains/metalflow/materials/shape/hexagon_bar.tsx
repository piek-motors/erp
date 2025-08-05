import { EnUnit, uiUnit } from 'domain-model'
import { t } from 'domains/metalflow/text'
import { observer } from 'lib/deps'
import { Inp, InputStack } from 'lib/index'
import { material } from '../material.store'

export const HexagonBarMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        unit={uiUnit(EnUnit.MilliMeter)}
        value={material.hexagon.diameter}
        onChange={v => {
          material.hexagon.setDiameter(v)
        }}
      />
    </InputStack>
  )
})
