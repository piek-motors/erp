import { Card } from '@mui/joy'
import { Tabs } from 'components/tabs'
import {
  AlloyAutocomplete,
  MaterialUnitSelect
} from 'domains/metalflow/shared/basic'
import { Inp, Stack, observer, useNavigate } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { EnMaterialShape } from 'models'
import { SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { tabList } from './tabs-config'

export const MaterialFormFields = observer((props: { showTabs?: boolean }) => {
  const navigate = useNavigate()
  return (
    <Card variant="outlined" size="sm">
      <Stack gap={1}>
        {props.showTabs ? (
          <Tabs
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
        <MaterialUnitSelect
          value={api.s.unit}
          onChange={v => api.s.setUnit(v)}
        />
        <SaveAndDelete
          itemName={`Материал (${api.s.id}) - ${api.s.label}`}
          handleDelete={() =>
            api.delete().then(() => {
              navigate(openPage(routeMap.metalflow.materials))
            })
          }
          handleSave={() => api.update()}
        />
      </Stack>
    </Card>
  )
})
