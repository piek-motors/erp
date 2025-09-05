/** @jsxImportSource @emotion/react */
import { Box, Card } from '@mui/joy'
import { FactoryPage } from 'components/factory_page'
import { AddResourceButton, Loading, P, Pre } from 'lib/index'
import { openOrderDetailPage, routeMap } from 'lib/routes'
import { RouteConfig } from 'lib/types/global'
import { observer } from 'mobx-react-lite'
import { Order } from 'models'
import { useEffect } from 'react'
import * as dnd from 'react-beautiful-dnd'
import { useNavigate } from 'react-router'
import { ColocatedStateKey, reclamationStore } from './store'

interface Props {
  order: Order
}

function ReclamationItem({ order }: Props) {
  const navigate = useNavigate()
  return (
    <Card
      sx={{ my: 1, backgroundColor: order.getBackgroundColor() }}
      variant="outlined"
      onDoubleClick={() => navigate(openOrderDetailPage(order.id))}
    >
      <P color="primary">
        {order.contractor}__{order.city}
      </P>
      <div>
        {order.items.length ? (
          order.items.map(item => (
            <div key={item.id}>
              <Pre>- {item.name}</Pre>
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
  data: Order[]
}

function DroppableContainer({
  columnName,
  droppableId,
  data
}: IDroppableContainerProps) {
  return (
    <Box key={droppableId} sx={{ height: '100%', width: '100%' }}>
      <P color="neutral" level="h4">
        {columnName}
      </P>
      <dnd.Droppable
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
              <dnd.Draggable
                key={item.id.toString()}
                draggableId={item.id.toString()}
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
                    <ReclamationItem order={item} />
                  </div>
                )}
              </dnd.Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </dnd.Droppable>
    </Box>
  )
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: dnd.DraggingStyle | dnd.NotDraggingStyle
) => ({
  ...draggableStyle
})

export const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'var(--L2)' : 'inherit'
})

const Reclamation = observer(() => {
  const handleOnDragEnd: dnd.OnDragEndResponder = result => {
    const { source, destination, draggableId } = result
    if (!destination) return

    reclamationStore.handleDragEnd(
      source as { droppableId: ColocatedStateKey; index: number },
      destination as { droppableId: ColocatedStateKey; index: number },
      draggableId
    )
  }

  return (
    <dnd.DragDropContext onDragEnd={handleOnDragEnd}>
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
          data={reclamationStore.state.inbox}
        />
        <DroppableContainer
          columnName="Принятие решения"
          droppableId="decision"
          data={reclamationStore.state.decision}
        />
        <DroppableContainer
          columnName="В производстве"
          droppableId="inproduction"
          data={reclamationStore.state.inproduction}
        />
      </Box>
    </dnd.DragDropContext>
  )
})

const ReclamationPage = observer(() => {
  const navigate = useNavigate()

  useEffect(() => {
    reclamationStore.load()
  }, [])

  return (
    <FactoryPage
      title="Рекламация"
      header={
        <AddResourceButton
          onClick={() =>
            navigate(routeMap.order.new, { state: { reclamation: true } })
          }
        />
      }
    >
      <Box>
        {reclamationStore.loading && <Loading />}
        <Reclamation />
      </Box>
    </FactoryPage>
  )
})

export default [
  {
    element: <ReclamationPage />,
    path: routeMap.reclamation
  }
] as RouteConfig[]
