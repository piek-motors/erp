/** @jsxImportSource @emotion/react */
import { TabConfig, Tabs } from 'components/tabs'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import {
  ExecuteAction,
  Inp,
  observer,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { EnMaterialShape, UiMaterialShape } from 'models'
import { AlloyAutocomplete } from '../shared/basic'
import { t } from '../text'
import { api } from './api'
import { HexagonBarMaterialInputBase } from './shape/hexagon_bar'
import { ListMaterialInputBase } from './shape/list'
import { PipeMaterialInputBase } from './shape/pipe'
import { RoundBarInputBase } from './shape/round_bar'
import { SquareMaterialInputBase } from './shape/square'

// Should be in proper order with EnMaterialShape
export const tabList: TabConfig = [
  {
    value: EnMaterialShape.RoundBar,
    label: UiMaterialShape[EnMaterialShape.RoundBar],
    component: <RoundBarInputBase />
  },
  {
    value: EnMaterialShape.List,
    label: UiMaterialShape[EnMaterialShape.List],
    component: <ListMaterialInputBase />
  },
  {
    value: EnMaterialShape.Pipe,
    label: UiMaterialShape[EnMaterialShape.Pipe],
    component: <PipeMaterialInputBase />
  },
  {
    value: EnMaterialShape.SquareBar,
    label: UiMaterialShape[EnMaterialShape.SquareBar],
    component: <SquareMaterialInputBase />
  },
  {
    value: EnMaterialShape.HexagonBar,
    label: UiMaterialShape[EnMaterialShape.HexagonBar],
    component: <HexagonBarMaterialInputBase />
  }
] as const

export const MaterialAddPage = observer(() => {
  useEffect(() => {
    api.reset()
  }, [])

  return (
    <Stack gap={1} py={2}>
      <MetalPageTitle subTitle={t.AddMaterial} />
      <Tabs
        tabs={tabList}
        handleChange={value => {
          api.s.setShape(value as unknown as EnMaterialShape)
        }}
      />
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
      {/* <MaterialUnitSelect
        value={material.unit}
        onChange={v => material.setUnit(v)}
      /> */}
      <ExecuteAction onSubmit={() => api.insert()} />
      {api.s.insertedMaterialId && (
        <TakeLookHint
          text={t.RecentlyNewMaterialAdded}
          link={openPage(
            routeMap.metalflow.material.edit,
            api.s.insertedMaterialId
          )}
        />
      )}
    </Stack>
  )
})
