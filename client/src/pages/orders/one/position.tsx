/** @jsxImportSource @emotion/react */
import { Box, Stack, Typography } from '@mui/joy'
import { OrderItem } from 'domain-model'
import { observer } from 'mobx-react-lite'
import { DeleteResourceButton, Row, UpdateResourceButton } from 'shortcuts'
import { useDeleteOrderItemByPkMutation } from 'types/graphql-shema'
import { orderStore } from './order.store'
import { orderPositionsItemStyle } from './prints.styles'
import { useOrderDetailStore } from './state'

interface IOrderItemListProps {
  data: OrderItem[]
  refetch: () => void
}

/**
 * @component PositionsList
 * @description Renders a list of order items with their details and optional edit/delete actions
 */
export const PositionsList = observer(
  ({ data, refetch }: IOrderItemListProps) => {
    const { setEditedOrderItem } = useOrderDetailStore()
    const [deleteItemMutation] = useDeleteOrderItemByPkMutation()
    const handleEditClick = (target: OrderItem) => setEditedOrderItem(target)

    function handleDeleteClick(target: OrderItem) {
      deleteItemMutation({
        variables: { id: target.id },
        onCompleted() {
          refetch()
        }
      })
    }

    return (
      <Stack gap={1}>
        {data?.map((position, index) => (
          <Box key={index}>
            <Row justifyContent="space-between" css={orderPositionsItemStyle}>
              <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                {position.name}
              </Typography>
              <Typography fontFamily={'monospace'} fontSize={'1.2rem'}>
                {position.quantity} шт
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
            <Typography>{position.description}</Typography>
          </Box>
        ))}
      </Stack>
    )
  }
)
