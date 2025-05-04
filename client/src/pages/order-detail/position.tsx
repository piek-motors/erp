/** @jsxImportSource @emotion/react */
import { Box, Stack, Typography } from '@mui/joy'
import { ReactNode } from 'react'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderItem } from 'src/types/global'
import { useDeleteOrderItemByPkMutation } from 'src/types/graphql-shema'
import {
  DeleteResourceButton,
  Row,
  UpdateResourceButton
} from '../../shortcuts'

export interface IPositionProps {
  sequence_number: number
  orderItem: TOrderItem
  children: ReactNode
}

interface IOrderItemListProps {
  data: TOrderItem[]
  refetch: () => void
  gap: number
}

export function PositionsList({ data, refetch, gap }: IOrderItemListProps) {
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
    <Stack gap={gap}>
      {data.map((position, index) => (
        <Box>
          {
            <div key={position.OrderItemID}>
              <Row justifyContent="space-between">
                <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                  {position.Name}
                </Typography>
                <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                  {' '}
                  {position.Quantity} шт
                </Typography>
              </Row>
              {editMode && (
                <Row gap={1}>
                  <UpdateResourceButton
                    onClick={() => handleEditClick(position)}
                  />
                  <DeleteResourceButton
                    onClick={() => handleDeleteClick(position)}
                  />
                </Row>
              )}
              <Typography>{position.FullName}</Typography>
            </div>
          }
        </Box>
      ))}
    </Stack>
  )
}
