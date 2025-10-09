import { Card } from '@mui/joy'
import { Tabs } from 'components/tabs'
import { AlloyAutocomplete, MaterialUnitSelect } from 'domains/pdo/shared/basic'
import { Inp, Stack, observer } from 'lib/index'
import { EnMaterialShape } from 'models'
import { api } from './api'
import { tabList } from './tabs-config'

export const MaterialFormFields = observer((props: { showTabs?: boolean }) => (
  <Card variant="outlined" size="sm">
    <Stack gap={1}>
      {props.showTabs ? (
        <Tabs
          p={0}
          tabs={tabList}
          handleChange={value => {
            api.s.setShape(value as unknown as EnMaterialShape)
          }}
        />
      ) : (
        tabList.find(t => t.value === api.s.shape)?.component
      )}
      <AlloyAutocomplete
        setAlloy={alloy => {
          api.s.setAlloy(alloy)
        }}
        alloy={api.s.alloy}
      />
      <Inp
        label={'Линейная масса'}
        value={api.s.linearMass}
        onChange={v => {
          api.s.setLinearMass(v)
        }}
        unit="кг/м"
      />
      <Inp
        label={'Безопасный остаток'}
        value={api.s.safetyStock}
        onChange={v => {
          api.s.setSafetyStock(v)
        }}
      />
      <MaterialUnitSelect value={api.s.unit} onChange={v => api.s.setUnit(v)} />
    </Stack>
  </Card>
))
