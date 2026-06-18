import { Tooltip } from '@mui/joy'
import { P } from '@/lib/index'
import type { DetailSt } from './detail.state'

type DetailWithStockDelta = Pick<DetailSt, 'safe_stock_leftover'> & {
  warehouse?: Pick<DetailSt['warehouse'], 'stock'>
  on_hand_balance?: number
}

interface Props {
  detail: DetailWithStockDelta
}

export const DetailStockDelta = ({ detail }: Props) => {
  if (detail.safe_stock_leftover == null) return null

  const stock = detail.warehouse?.stock ?? detail.on_hand_balance ?? 0
  const delta = stock - detail.safe_stock_leftover
  if (delta === 0) return null

  if (delta < 0) {
    return (
      <Tooltip title={`Дефицит: не хватает ${Math.abs(delta)}`} size="sm">
        <P color="danger" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
          -{Math.abs(delta)}
        </P>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={`Профицит: сверх норматива ${delta}`} size="sm">
      <P color="success" sx={{ whiteSpace: 'nowrap' }}>
        +{delta}
      </P>
    </Tooltip>
  )
}
