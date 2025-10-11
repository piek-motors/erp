/** @jsxImportSource @emotion/react */
import { Box, Stack } from '@mui/joy'
import { DeleteResourceButton, P, Row, UpdateResourceButton } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { orderStore } from '../order.store'
import { orderPositionsItemStyle } from '../prints.styles'

/**
 * @component PositionsList
 * @description Renders a list of order items with their details and optional edit/delete actions
 */
export const PositionsList = observer(() => {
  if (!orderStore.order) {
    return <div>No data</div>
  }
  return (
    <Stack gap={1}>
      {orderStore.positions.items.map((position, index) => (
        <Box key={index}>
          <Row
            justifyContent="space-between"
            css={orderPositionsItemStyle}
            gap={4}
          >
            <P fontFamily={'monospace'} fontSize={'1.2rem'}>
              {position.name}
            </P>

            <Row>
              <P
                fontFamily={'monospace'}
                fontSize={'1.2rem'}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {position.quantity} шт
              </P>
              {orderStore.editMode && (
                <Row gap={1}>
                  <UpdateResourceButton
                    onClick={() => orderStore.positions.openDialog(position)}
                  />
                  <DeleteResourceButton
                    onClick={() => orderStore.positions.delete(position.id)}
                  />
                </Row>
              )}
            </Row>
          </Row>
          <P>{position.description}</P>
        </Box>
      ))}
    </Stack>
  )
})
