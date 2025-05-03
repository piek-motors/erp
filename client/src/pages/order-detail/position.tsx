/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography } from '@mui/joy'
import { ReactNode } from 'react'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderItem } from 'src/types/global'
import { useDeleteOrderItemByPkMutation } from 'src/types/graphql-shema'
import { DeteleButton, EditButton, Row } from '../../shortcuts'

export interface IPositionProps {
  sequence_number: number
  orderItem: TOrderItem
  children: ReactNode
}

function Position({ sequence_number, orderItem, children }: IPositionProps) {
  const styles = css`
    position: relative;
    padding: 1.3em;
    display: grid;
    grid-template-columns: 15fr 1fr auto;

    .name,
    .quantity {
      font-family: 'IBM Plex Mono' !important;
      font-size: 1.2rem;
    }

    .quantity {
      color: var(--accent);
      min-width: max-content;
    }

    .fullName {
      grid-column-start: 1;
      grid-column-end: 3;
      color: var(--lowContrast) !important;
      font-weight: normal;
      padding-top: 5px;
    }
  `

  return (
    <div key={orderItem.OrderItemID} css={styles}>
      <Typography className="name">{orderItem.Name}</Typography>
      <span className="quantity"> {orderItem.Quantity} шт.</span>
      {children}
      <div className="fullName"> {orderItem.FullName}</div>
    </div>
  )
}

interface IOrderItemListProps {
  data: TOrderItem[]
  refetch: () => void
}

export default function OrderItemList({ data, refetch }: IOrderItemListProps) {
  const { setEditedOrderItem, editMode } = useOrderDetailStore()
  const [deleteItemMutation] = useDeleteOrderItemByPkMutation()

  const handleEditClick = (target: TOrderItem) => setEditedOrderItem(target)

  function handleDeleteClick(target: TOrderItem) {
    deleteItemMutation({
      variables: { id: target.OrderItemID },
      onCompleted() {
        refetch()
      }
    })
  }

  return (
    <div className="Composition">
      {data.map((position, index) => (
        <Position sequence_number={index + 1} orderItem={position} key={index}>
          {editMode && (
            <Row gap={1}>
              <EditButton onClick={() => handleEditClick(position)} />
              <DeteleButton onClick={() => handleDeleteClick(position)} />
            </Row>
          )}
        </Position>
      ))}
    </div>
  )
}
