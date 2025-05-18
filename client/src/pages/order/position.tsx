/** @jsxImportSource @emotion/react */
import { Box, Stack, Typography } from '@mui/joy'
import { Observer } from 'mobx-react-lite'
import { DeleteResourceButton, Row, UpdateResourceButton } from 'shortcuts'
import { TOrderItem } from 'types/global'
import { useDeleteOrderItemByPkMutation } from 'types/graphql-shema'
import { orderStore } from './order.store'
import { orderPositionsItemStyle } from './prints.styles'
import { useOrderDetailStore } from './state'

interface IOrderItemListProps {
  data: TOrderItem[]
  refetch: () => void
  gap: number
}

export function PositionsList({ data, refetch, gap }: IOrderItemListProps) {
  const { setEditedOrderItem } = useOrderDetailStore()
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
    <Observer
      render={() => {
        return (
          <Stack gap={gap}>
            {data.map((position, index) => (
              <Box key={index}>
                <Row
                  justifyContent="space-between"
                  css={orderPositionsItemStyle}
                >
                  <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                    {position.Name}
                  </Typography>
                  <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                    {position.Quantity} шт
                  </Typography>

                  {orderStore.editMode && (
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
      }}
    />
  )
}


