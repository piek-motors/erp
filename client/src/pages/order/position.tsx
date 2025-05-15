/** @jsxImportSource @emotion/react */
import { Box, Stack, Typography } from '@mui/joy'
import { DeleteResourceButton, Row, UpdateResourceButton } from 'shortcuts'
import { TOrderItem } from 'types/global'
import { useDeleteOrderItemByPkMutation } from 'types/graphql-shema'
import { useOrderDetailStore } from './state'

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
        <Box key={index}>
          <Row justifyContent="space-between">
            <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
              {position.Name}
            </Typography>
            <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
              {' '}
              {position.Quantity} шт
            </Typography>

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
          </Row>
          <Typography>{position.FullName}</Typography>
        </Box>
      ))}
    </Stack>
  )
}
