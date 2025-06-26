import { EnUnit, uiUnit } from 'domain-model'
import { Inp, InputStack, observer } from 'lib/index'
import { AlloyAutocomplete } from 'metalflow/shared/basic'
import { t } from 'metalflow/text'
import { material } from '../material.state'

export const SquareMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Length}
        value={material.square.length}
        onChange={v => {
          material.square.setLength(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          material.square.setAlloy(alloy)
        }}
        alloy={material.square.alloy}
      />
    </InputStack>
  )
})
