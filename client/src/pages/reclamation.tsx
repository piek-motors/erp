/** @jsxImportSource @emotion/react */
import { Box, Card, Typography } from '@mui/joy'
import { useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
  OnDragEndResponder
} from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { OrderStatus } from 'shared'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig, TReclamationOrder } from 'src/types/global'
import {
  useGetReclamationOrdersQuery,
  useInsertOrderMutation,
  useUpdateOrderStatusMutation
} from 'src/types/graphql-shema'
import { PageTitle } from '../components'
import { AddResourceButton, Pre } from '../shortcuts'

interface IReclamationProps {
  inbox: TReclamationOrder[]
  decision: TReclamationOrder[]
  inproduction: TReclamationOrder[]
}

// a little function to help us with reordering the result
const reorder = (
  list: TReclamationOrder[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: TReclamationOrder[],
  destination: TReclamationOrder[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone
  }
}

const getOrderStatusByDroppableId = (
  droppableId: ColocatedStateKey
): number => {
  switch (droppableId) {
    case 'inbox':
      return OrderStatus.reclInbox
    case 'decision':
      return OrderStatus.reclDecision
    case 'inproduction':
      return OrderStatus.reclProduction
    default:
      throw Error('droppableId is not valid')
  }
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle
) => ({
  ...draggableStyle
})

export const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'var(--L2)' : 'inherit'
})

export type ColocatedStateKey = 'inbox' | 'decision' | 'inproduction'

type State = Record<ColocatedStateKey, TReclamationOrder[]>

function Reclamation(props: IReclamationProps) {
  const [updateOrderStatus] = useUpdateOrderStatusMutation()
  const [state, setState] = useState<State>({
    inbox: props.inbox,
    decision: props.decision,
    inproduction: props.inproduction
  })

  const handleOnDragEnd: OnDragEndResponder = result => {
    const { source, destination, draggableId } = result
    // dropped outside the list
    if (!destination) {
      return
    }
    const sInd = source.droppableId as ColocatedStateKey
    const dInd = destination.droppableId as ColocatedStateKey
    if (source.droppableId === destination.droppableId) {
      const array = state[sInd]
      const items = reorder(array, source.index, destination.index)
      setState({
        ...state,
        [source.droppableId]: items
      })
    } else {
      const result = move(state[sInd], state[dInd], source, destination)
      setState({ ...state, ...result })
      const draggableElement: TReclamationOrder = state[sInd].find(
        each => each.OrderID.toString() === draggableId
      )!
      updateOrderStatus({
        variables: {
          OrderID: draggableElement.OrderID,
          OrderStatusID: getOrderStatusByDroppableId(dInd)
        }
      })
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box
        sx={{
          margin: 0,
          bottom: 0,
          display: 'grid !important',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 2
        }}
      >
        <DroppableContainer
          columnName="Входящие"
          droppableId="inbox"
          data={state.inbox}
        />
        <DroppableContainer
          columnName="Принятие решения"
          droppableId="decision"
          data={state.decision}
        />
        <DroppableContainer
          columnName="В производстве"
          droppableId="inproduction"
          data={state.inproduction}
        />
      </Box>
    </DragDropContext>
  )
}

export interface IReclamationItemProps {
  order: TReclamationOrder
}

function ReclamationItem({ order }: IReclamationItemProps) {
  const link = AppRoutes.order_detail.replace(':id', order.OrderID.toString())
  const navigate = useNavigate()
  return (
    <Card sx={{ my: 1 }} variant="soft" onDoubleClick={() => navigate(link)}>
      <Typography color="primary">
        {order.Entity}__{order.City}
      </Typography>
      <div>
        {order.OrderItems.length ? (
          order.OrderItems.map(item => (
            <div key={item.OrderItemID}>
              <Pre>- {item.Name}</Pre>
            </div>
          ))
        ) : (
          <div>Не заполнено</div>
        )}
      </div>
    </Card>
  )
}

export interface IDroppableContainerProps {
  columnName: string
  droppableId: ColocatedStateKey
  data: TReclamationOrder[]
}

function DroppableContainer({
  columnName,
  droppableId,
  data
}: IDroppableContainerProps) {
  return (
    <Box key={droppableId} sx={{ height: '100%', width: '100%' }}>
      <Typography>{columnName}</Typography>
      <Droppable
        droppableId={droppableId.toString()}
        isDropDisabled={false}
        isCombineEnabled={false}
        direction="vertical"
        key={droppableId}
        ignoreContainerClipping={false}
      >
        {(provided, snapshot) => (
          <Box ref={provided.innerRef} sx={{ height: '100%', width: '100%' }}>
            {data.map((item, index) => (
              <Draggable
                key={item.OrderID.toString()}
                draggableId={item.OrderID.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style!
                    )}
                  >
                    {<ReclamationItem order={item} />}
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  )
}

function ReclamationContainer() {
  const navigate = useNavigate()
  const [insertOrder] = useInsertOrderMutation({
    variables: {
      orderStatusID: OrderStatus.reclInbox
    }
  })
  async function handleAddOrder() {
    const res = await insertOrder()
    const id = res.data?.insert_erp_Orders?.returning[0].OrderID
    navigate(AppRoutes.order_detail + id + ' ?edit=true')
  }
  const { data, loading } = useGetReclamationOrdersQuery()
  const filterByStatus = (array: TReclamationOrder[], status: OrderStatus) => {
    if (!array) return []
    return array.filter(each => each.OrderStatusID === status)
  }
  return (
    <>
      <PageTitle title="Рекламация">
        <AddResourceButton onClick={handleAddOrder} />
      </PageTitle>

      <Box p={1}>
        {!loading && (
          <Reclamation
            inbox={filterByStatus(
              data?.erp_Orders || [],
              OrderStatus.reclInbox
            )}
            decision={filterByStatus(
              data?.erp_Orders || [],
              OrderStatus.reclDecision
            )}
            inproduction={filterByStatus(
              data?.erp_Orders || [],
              OrderStatus.reclProduction
            )}
          />
        )}
      </Box>
    </>
  )
}

export default [
  {
    element: <ReclamationContainer />,
    path: AppRoutes.reclamation
  }
] as RouteConfig[]
