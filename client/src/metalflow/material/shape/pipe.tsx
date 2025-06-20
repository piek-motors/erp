import { EnUnit, uiUnit } from 'domain-model'
import { Inp, InputStack, observer } from 'lib/index'
import { AlloyAutocomplete } from 'metalflow/shared/basic'
import { material } from 'metalflow/store'
import { t } from 'metalflow/text'

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
        label={t.Thickness}
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
