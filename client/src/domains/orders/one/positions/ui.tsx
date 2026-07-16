import { Stack } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { Copyable } from '@/components/copyable'
import { CreateDetailRequestButton } from '@/domains/pdo/detail_requests/create_button'
import { DeleteIcon, P, Row, UpdateResourceButton } from '@/lib/index'
import { orderStore } from '../order.store'
import { orderPositionsItemStyle } from '../prints.styles'

/**
 * @component PositionsList
 * @description Renders a list of order items with their details and optional edit/delete actions
 */
export const PositionsList = observer(
  (props: { showRequirementActions?: boolean }) => {
    const showRequirementActions = props.showRequirementActions ?? true

    if (!orderStore.order) {
      return <div>No data</div>
    }
    const order = orderStore.order

    function copyPositionName(position: {
      id: number
      name: string
      qty: number
    }) {
      return `${position.name.trim()}__${position.qty}шт`
    }

    return (
      <Stack gap={1}>
        {orderStore.positions.items.map(position => (
          <Copyable
            key={position.id}
            copyKey={position.id}
            text={copyPositionName(position)}
          >
            <Row
              justifyContent="space-between"
              css={orderPositionsItemStyle}
              gap={4}
              noWrap
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
                  {position.qty} шт
                </P>
                {showRequirementActions && (
                  <CreateDetailRequestButton
                    initialOrderId={order.id}
                    initialProductName={position.name}
                    initialProductQty={position.qty}
                  />
                )}
                {orderStore.editMode && (
                  <Row gap={1} onClick={event => event.stopPropagation()}>
                    <UpdateResourceButton
                      onClick={() => {
                        orderStore.positions.openDialog(position)
                      }}
                    />
                    <DeleteIcon
                      onClick={() => {
                        orderStore.positions.delete(position.id)
                      }}
                    />
                  </Row>
                )}
              </Row>
            </Row>
            <P>{position.description}</P>
          </Copyable>
        ))}
      </Stack>
    )
  },
)
