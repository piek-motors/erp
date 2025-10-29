import { NumberInput } from 'components/inputs/number_input'
import { Tabs } from 'components/tabs'
import { AlloyAutocomplete, MaterialUnitSelect } from 'domains/pdo/shared/basic'
import { Stack, observer } from 'lib/index'
import { MaterialShape } from 'models'
import { MaterialState } from './state'
import { tabsConfig } from './tabs-config'

export const MaterialFormFields = observer(
  ({ showTabs, m }: { showTabs?: boolean; m: MaterialState }) => {
    const tabs = tabsConfig(m)
    return (
      <Stack>
        {showTabs ? (
          <Tabs
            p={0}
            tabs={tabs}
            handleChange={value => {
              m.setShape(value as unknown as MaterialShape)
            }}
          />
        ) : (
          tabs.find(t => t.value === m.shape)?.component
        )}
        <AlloyAutocomplete
          setAlloy={alloy => {
            m.setAlloy(alloy)
          }}
          alloy={m.alloy}
        />
        {/* <Inp
          label={'Линейная масса'}
          value={m.linearMass}
          onChange={v => {
            m.setLinearMass(v)
          }}
          unit="кг/м"
        /> */}
        <NumberInput
          label={'Норм. остаток'}
          value={m.safetyStock}
          onChange={v => {
            m.setSafetyStock(v)
          }}
        />
        <MaterialUnitSelect value={m.unit} onChange={v => m.setUnit(v)} />
      </Stack>
    )
  }
)
