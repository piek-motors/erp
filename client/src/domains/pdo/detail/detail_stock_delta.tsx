import { Indicator } from '@/domains/pdo/shared/basic'
import { StockDelta } from '@/domains/pdo/shared/stock_delta'
import { P, Row } from '@/lib/index'
import type { DetailSt } from './detail.state'

type DetailWithStockDelta = Pick<DetailSt, 'safe_stock_leftover'> & {
  warehouse?: Pick<DetailSt['warehouse'], 'stock'>
  on_hand_balance?: number
}

interface Props {
  detail: DetailWithStockDelta
}

export const DetailStockDelta = ({ detail }: Props) => {
  return (
    <StockDelta
      stock={detail.warehouse?.stock ?? detail.on_hand_balance}
      safeStockLeftover={detail.safe_stock_leftover}
    />
  )
}

export const DetailDeficitIndicator = ({
  deficit,
}: {
  deficit: number | null
}) => {
  if (deficit == null || deficit <= 0) return null

  return (
    <Row gap={0.75} flexWrap="nowrap">
      <Indicator title="Дефицит" color="rgba(255, 7, 7, 0.8)" />
      <P level="body-xs" color="danger" noWrap>
        Дефицит {deficit} шт.
      </P>
    </Row>
  )
}
