/** @jsxImportSource @emotion/react */
import { TabConfig, Tabs } from 'components/tabs'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import {
  Inp,
  observer,
  SendMutation,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { AlloyAutocomplete } from '../shared/basic'
import { t } from '../text'
import { material } from './material.store'
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
  }
] as const

export const MaterialAddPage = observer(() => {
  useEffect(() => {
    return () => {
      material.clear()
    }
  }, [])

  return (
    <Stack gap={1} py={2}>
      <MetalPageTitle subTitle={t.AddMaterial} />
      <Tabs
        tabs={tabList}
        handleChange={value => {
          material.setShape(value as unknown as EnMaterialShape)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          material.setAlloy(alloy)
        }}
        alloy={material.alloy}
      />
      <Inp
        label={'Линейная масса'}
        value={material.linearMass}
        onChange={v => {
          material.setLinearMass(v)
        }}
        unit="кг/м"
      />
      {/* <MaterialUnitSelect
        value={material.unit}
        onChange={v => material.setUnit(v)}
      /> */}
      <SendMutation onClick={() => material.insert()} />
      {material.insertedMaterialId && (
        <TakeLookHint
          text={t.RecentlyNewMaterialAdded}
          link={open(
            routeMap.metalflow.material.edit,
            material.insertedMaterialId
          )}
        />
      )}
    </Stack>
  )
})
