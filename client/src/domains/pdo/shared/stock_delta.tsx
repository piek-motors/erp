import { Tooltip } from '@mui/joy'
import type { Unit } from 'shared'
import { uiUnit } from 'shared'
import { P, Row } from '@/lib/index'

interface StockDeltaProps {
  stock?: number | null
  safeStockLeftover?: number | null
  unit?: Unit | null
  formatValue?: (value: number) => string | number | null
}

export const StockDelta = ({
  stock,
  safeStockLeftover,
  unit,
  formatValue = value => value,
}: StockDeltaProps) => {
  if (safeStockLeftover == null) return null

  const delta = (stock ?? 0) - safeStockLeftover
  if (delta === 0) return null

  const absDelta = Math.abs(delta)
  const formattedDelta = formatValue(absDelta) ?? absDelta
  const unitLabel = unit == null ? '' : ` ${uiUnit(unit)}`

  if (delta < 0) {
    return (
      <Tooltip
        title={`Дефицит: не хватает ${formattedDelta}${unitLabel}`}
        size="sm"
      >
        <Row gap={0.5} flexWrap="nowrap">
          <P color="danger" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
            -{formattedDelta}
          </P>
          {unit != null && <P level="body-xs">{uiUnit(unit)}</P>}
        </Row>
      </Tooltip>
    )
  }

  const formattedPositiveDelta = formatValue(delta) ?? delta

  return (
    <Tooltip
      title={`Профицит: сверх норматива ${formattedPositiveDelta}${unitLabel}`}
      size="sm"
    >
      <Row gap={0.5} flexWrap="nowrap">
        <P color="success" sx={{ whiteSpace: 'nowrap' }}>
          +{formattedPositiveDelta}
        </P>
        {unit != null && <P level="body-xs">{uiUnit(unit)}</P>}
      </Row>
    </Tooltip>
  )
}
