import { NumberInput } from 'components/inputs/number_input'
import { Tabs } from 'components/tabs'
import { AlloyAutocomplete, MaterialUnitSelect } from 'domains/pdo/shared/basic'
import { Box, Label, Stack, observer } from 'lib/index'
import { MaterialShape, UiMaterialShape } from 'models'
import { MaterialSpecificInput } from './shape/main'
import { MaterialState } from './state'

export const MaterialFormFields = observer(
  ({
    showTabs,
    m,
    disabled
  }: {
    showTabs?: boolean
    m: MaterialState
    disabled?: boolean
  }) => (
    <Stack gap={0.5}>
      {showTabs ? (
        <Tabs
          variant="plain"
          sx={{ width: 'fit-content' }}
          p={0}
          tabs={Object.values(MaterialShape)
            .filter(e => typeof e !== 'string')
            .map(value => ({
              label: UiMaterialShape[value],
              value,
              component: <MaterialSpecificInput m={m} disabled={disabled} />
            }))}
          handleChange={value => {
            m.setShape(value as unknown as MaterialShape)
          }}
        />
      ) : (
        <MaterialSpecificInput m={m} disabled={disabled} />
      )}
      <MaterialUnitSelect value={m.unit} onChange={v => m.setUnit(v)} />
      <AlloyAutocomplete
        setAlloy={alloy => {
          m.setAlloy(alloy)
        }}
        alloy={m.alloy}
      />
      <Box>
        <Stack>
          <Label>Сигнал о дефиците за N дней</Label>
          <Label xs color="warning">
            Сколько дней в прошлом требовалось чтобы восполнить запас
          </Label>
        </Stack>
        <NumberInput
          value={m.shortagePredictionHorizonDays}
          onChange={v => {
            m.setShortageOredictionHorizonDays(v)
          }}
        />
      </Box>
    </Stack>
  )
)
