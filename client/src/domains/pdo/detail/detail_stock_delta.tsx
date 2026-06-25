import { StockDelta } from '@/domains/pdo/shared/stock_delta'
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
