/** @jsxImportSource @emotion/react */
import { Box, Card, Stack, Typography } from '@mui/joy'
import { PageTitle } from 'components'
import { Order } from 'domain-model'
import { AppRoutes } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import * as dnd from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { AddResourceButton, LoadingHint, Pre } from 'shortcuts'
import { RouteConfig } from 'types/global'
import { ColocatedStateKey, reclamationStore } from './store'

export interface IReclamationItemProps {
  order: Order
}

function ReclamationItem({ order }: IReclamationItemProps) {
  const link = AppRoutes.order_detail.replace(':id', order.id.toString())
  const navigate = useNavigate()
  return (
    <Card
      sx={{ my: 1, backgroundColor: order.getBackgroundColor() }}
      variant="soft"
      onDoubleClick={() => navigate(link)}
    >
      <Typography color="primary">
        {order.contractor}__{order.city}
      </Typography>
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
      <Typography color="neutral" level="h4">
        {columnName}
      </Typography>
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
    <Stack p={1}>
      <PageTitle title="Рекламация">
        <AddResourceButton
          onClick={() => {
            navigate(AppRoutes.new_order, { state: { reclamation: true } })
          }}
        />
      </PageTitle>

      <Box>
        <LoadingHint show={reclamationStore.loading} />
        <Reclamation />
      </Box>
    </Stack>
  )
})

export default [
  {
    element: <ReclamationPage />,
    path: AppRoutes.reclamation
  }
] as RouteConfig[]
