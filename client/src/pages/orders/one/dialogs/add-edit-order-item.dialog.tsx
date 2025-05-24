import {
  Box,
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Typography
} from '@mui/joy'
import { OrderItem } from 'domain-model'
import { useOrderDetailStore } from 'pages/orders/one/state'
import { useEffect, useState } from 'react'
import { CancelButton, MultilineInput, MyInput, Row } from 'shortcuts'
import {
  useInsertOrderItemMutation,
  useUpdateOrderItemByPkMutation
} from 'types/graphql-shema'

export interface IDialogEditOrderItemProps {
  refetch: () => void
}

export function UpdatePositionBtn({ refetch }: IDialogEditOrderItemProps) {
  const {
    orderId,
    addOrderItemDialog: isOpen,
    setAddOrderItemDialog,
    editedOrderItem
  } = useOrderDetailStore()

  const defaultState: Partial<OrderItem> = {}

  const [orderItem, setState] = useState<Partial<OrderItem>>(
    editedOrderItem || defaultState
  )

  useEffect(() => {
    setState(editedOrderItem || defaultState)
  }, [editedOrderItem])

  const [updateMutation] = useUpdateOrderItemByPkMutation()
  const [insertMutation] = useInsertOrderItemMutation()

  const handleClose = () => setAddOrderItemDialog(false)

  const handleUpdate = (): void => {
    handleClose()
    if (!orderItem.quantity || !orderItem.name || !orderItem.id) return

    updateMutation({
      variables: {
        id: orderItem.id,
        _set: {
          name: orderItem.name ?? '',
          quantity: orderItem.quantity,
          description: orderItem.description ?? ''
        }
      },
      onCompleted() {
        setState(defaultState)
        refetch()
      }
    })
  }

  const handlerInsert = (): void => {
    handleClose()
    if (!orderId) throw Error('orderId is null')
    if (!orderItem.quantity || !orderItem.name) throw Error()

    insertMutation({
      variables: {
        order_id: orderId,
        name: orderItem.name,
        quantity: orderItem.quantity,
        description: orderItem.description ?? ''
      },
      onCompleted() {
        setState(defaultState)
        refetch()
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    setState({
      ...orderItem,
      [e.target.name]: e.target.value
    })
  }

  const disableSaveButton = !Boolean(orderItem.name && orderItem.quantity)
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ModalDialog minWidth={600}>
        <ModalClose />
        <Typography level="h4" pb={2}>
          {editedOrderItem ? 'Изменить' : 'Добавить'} позицию
        </Typography>

        <Box display="flex" flexDirection="column">
          <MyInput
            fullWidth
            label="Наименование"
            value={orderItem.name}
            sx={{ mb: '8px' }}
            name="name"
            onChange={handleInputChange}
          />
          <MultilineInput
            label="Полное наименование"
            sx={{ mb: '8px' }}
            value={orderItem.description ?? ''}
            name="description"
            onChange={handleInputChange}
          />
          <MyInput
            label="Введите кол-во"
            type="number"
            name="quantity"
            sx={{ mb: '8px' }}
            value={orderItem.quantity}
            onChange={handleInputChange}
          />
        </Box>
        <Row gap={2}>
          {!orderItem.id ? (
            <Button onClick={handlerInsert} disabled={disableSaveButton}>
              Добавить
            </Button>
          ) : (
            <Button onClick={handleUpdate} disabled={disableSaveButton}>
              Сохранить
            </Button>
          )}
          <CancelButton onClick={handleClose} />
        </Row>
      </ModalDialog>
    </Modal>
  )
}
