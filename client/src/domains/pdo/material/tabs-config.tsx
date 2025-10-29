import { TabConfig } from 'components/tabs'
import { MaterialShape, UiMaterialShape } from 'models'
import { ArbitraryInputBase } from './shape/arbitrary'
import { HexagonBarMaterialInputBase } from './shape/hexagon_bar'
import { ListMaterialInputBase } from './shape/list'
import { PipeMaterialInputBase } from './shape/pipe'
import { RoundBarInputBase } from './shape/round_bar'
import { SquareMaterialInputBase } from './shape/square'
import { MaterialState } from './state'

export const tabsConfig = (m: MaterialState): TabConfig =>
  (
    [
      {
        value: MaterialShape.RoundBar,
        component: <RoundBarInputBase m={m} />
      },
      {
        value: MaterialShape.List,
        component: <ListMaterialInputBase m={m} />
      },
      {
        value: MaterialShape.Pipe,
        component: <PipeMaterialInputBase m={m} />
      },
      {
        value: MaterialShape.SquareBar,
        component: <SquareMaterialInputBase m={m} />
      },
      {
        value: MaterialShape.HexagonBar,
        component: <HexagonBarMaterialInputBase m={m} />
      },
      {
        value: MaterialShape.Arbitrary,
        component: <ArbitraryInputBase m={m} />
      }
    ] as const
  ).map(each => ({
    ...each,
    label: UiMaterialShape[each.value]
  }))
