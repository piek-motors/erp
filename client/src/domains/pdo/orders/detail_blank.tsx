import { Box, Divider, Stack } from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import { InfoLabel, Label, Row } from 'lib/index'
import { observer } from 'mobx-react-lite'
import {
  fmt,
  ManufacturingOrderStatus,
  MaterialRequirement,
  uiUnit,
} from 'models'
import { app_cache } from '../cache'
import {
  DetailBlankSt,
  MaterialRequirementSt,
} from '../detail/detail_blank.store'
import { BlankAttributes } from '../detail/detail_form'
import { MaterialName } from '../material/name'
import { OrderSt } from './order.state'

interface DetailBlankProps {
  blank: DetailBlankSt
  order: OrderSt
}

export const DetailBlank = observer(({ blank, order }: DetailBlankProps) => {
  const requirement = blank.material_requirement
  if (!requirement) return null

  const material = app_cache.materials.get(requirement.material_id)
  if (!material) return null

  const unit = uiUnit(material.unit)
  return (
    <Stack>
      <MaterialName id={material.id} label={material.label} />
      <InfoLabel
        label="Потребное кол."
        value={order.resp?.material_deduction}
        suffix={unit}
      />
      <WebOnly>
        <CalcMaterialRemainings requirement={requirement} order={order} />
      </WebOnly>
      <BlankTypeProperties
        requirement={requirement}
        unit={unit}
        quantity_to_produce={order.qty}
      />

      <DetailsRequirement blank={blank} />
      <Box py={1}>
        <BlankAttributes fontSize={14} attributes={blank.attributes} />
      </Box>
    </Stack>
  )
})

interface BlankTypePropertiesProps {
  requirement: MaterialRequirementSt
  unit: string
  quantity_to_produce?: number
}

const BlankTypeProperties = ({
  requirement,
  unit,
  quantity_to_produce,
}: BlankTypePropertiesProps) => {
  const { data } = requirement

  switch (data.type) {
    case MaterialRequirement.Single:
      return (
        <Stack>
          <WebOnly>
            <InfoLabel
              label="Норма расхода"
              value={data.gross_length}
              suffix={unit}
            />
          </WebOnly>
          {!!data.blank_length && (
            <InfoLabel
              label="Длина заготовки"
              value={data.blank_length}
              suffix={unit}
            />
          )}
        </Stack>
      )

    case MaterialRequirement.Batch: {
      const stocks_required =
        quantity_to_produce && data.yield_per_stock
          ? Math.ceil(quantity_to_produce / data.yield_per_stock)
          : undefined

      return (
        <Stack>
          <InfoLabel
            label="Длина прутка"
            value={data.stock_length}
            suffix={unit}
          />
          <InfoLabel label="Кол. прутков" value={stocks_required} />
          <InfoLabel label="Кол. дет. с прутка" value={data.yield_per_stock} />
        </Stack>
      )
    }

    case MaterialRequirement.Countable:
      return <InfoLabel label="Кол." value={data.count} suffix="шт." />

    default:
      return null
  }
}

const DetailsRequirement = observer(({ blank }: { blank: DetailBlankSt }) => {
  if (!blank.details_requirement.length) return null

  return (
    <>
      <Divider sx={{ my: 0.5 }} />
      {blank.details_requirement.map(each => (
        <Row key={each.detailId} gap={1}>
          <Label>{each.detail?.name}</Label>
          <InfoLabel label="" value={each.qty} suffix="шт" />
        </Row>
      ))}
    </>
  )
})

interface CalcMaterialRemainingsProps {
  requirement: MaterialRequirementSt
  order: OrderSt
}

export const CalcMaterialRemainings = observer(
  ({ requirement: cost, order }: CalcMaterialRemainingsProps) => {
    if (
      ![
        ManufacturingOrderStatus.Preparation,
        ManufacturingOrderStatus.Waiting,
      ].includes(order.status)
    )
      return

    const material = cost.material
    const unit = uiUnit(material?.unit)
    const totalConsumed = order.resp?.material_deduction || 0
    const remainingAmount = (material?.on_hand_balance || 0) - totalConsumed
    const color =
      remainingAmount > 0
        ? 'success'
        : remainingAmount < 0
          ? 'danger'
          : 'primary'
    return (
      <Box>
        {material?.on_hand_balance != null && (
          <>
            <InfoLabel
              label="Остаток материала"
              value={fmt.roundAndTrim(material.on_hand_balance, 3)}
              suffix={unit}
            />
            <InfoLabel
              label="Остаток после запуска"
              color={color}
              value={fmt.roundAndTrim(remainingAmount, 3)}
              suffix={unit}
            />
          </>
        )}
        <Divider />
      </Box>
    )
  },
)
