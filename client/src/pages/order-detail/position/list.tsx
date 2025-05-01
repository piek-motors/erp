import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderItem } from 'src/types/global'
import { useDeleteOrderItemByPkMutation } from 'src/types/graphql-shema'
import ActionsMenu from './action'
import Position from './position'

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
      {data.map((each, index) => (
        <Position sequence_number={index + 1} orderItem={each} key={index}>
          {editMode && (
            <ActionsMenu
              handleEditClick={() => handleEditClick(each)}
              handleDeleteClick={() => handleDeleteClick(each)}
            />
          )}
        </Position>
      ))}
    </div>
  )
}
