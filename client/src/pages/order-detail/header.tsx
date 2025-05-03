/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Typography } from '@mui/joy'
import { TOrder } from 'src/types/global'
import {
  orderStatus,
  orderStatusHighlighting
} from 'src/utils/orderColorIndication'
import OrderActions from './actions/order-actions'

interface IOrderHeaderProps {
  order: TOrder
}

const styles = css`
  grid-column: 1/3;
  border-bottom: var(--border);
  padding-left: 20px;
  display: flex;
  position: relative;
  align-items: center;
  .title {
    font-weight: 600;
    flex-grow: 2;
  }

  .needAttention::before,
  .awaitingDispatch::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
  }

  .awaitingDispatch::before {
    background: var(--awaitingDispatch) !important;
  }

  .needAttention::before {
    background: var(--needAttention) !important;
  }
`
export default function OrderHeader({ order }: IOrderHeaderProps) {
  return (
    <Box css={styles} p={1}>
      <Typography
        className={`title ${orderStatusHighlighting(order)}`}
        sx={{ fontSize: '1.1rem' }}
      >
        {order.Entity} __ {order.City}
        {orderStatus(order) ? (
          <span className="preorderTitle">{orderStatus(order)}</span>
        ) : null}
      </Typography>

      <Box className="noprint">
        <OrderActions order={order} />
      </Box>
    </Box>
  )
}
