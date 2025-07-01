import { EnUnit, uiUnit } from 'domain-model'
import { Inp, InputStack, observer } from 'lib/index'
import { AlloyAutocomplete } from 'metalflow/shared/basic'
import { t } from 'metalflow/text'
import { material } from '../material.state'

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
      <AlloyAutocomplete
        setAlloy={alloy => {
          material.pipe.setAlloy(alloy)
        }}
        alloy={material.pipe.alloy}
      />
    </InputStack>
  )
})
