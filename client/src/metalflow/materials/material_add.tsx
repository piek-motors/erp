/** @jsxImportSource @emotion/react */
import { PageTitle } from 'components/page-title'
import { TabConfig, Tabs } from 'components/tabs'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import {
  observer,
  SendMutation,
  Stack,
  TakeLookHint,
  useEffect
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { MaterialUnitSelect } from '../shared/basic'
import { t } from '../text'
import { material } from './material.state'
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
      <PageTitle subTitle={t.AddMaterial} hideIcon />
      <Tabs
        tabs={tabList}
        handleChange={value => {
          material.setShape(value as unknown as EnMaterialShape)
        }}
      />
      <MaterialUnitSelect
        value={material.unit}
        onChange={v => material.setUnit(v)}
      />
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
