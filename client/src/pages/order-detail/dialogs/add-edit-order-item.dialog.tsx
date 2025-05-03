import {
  Box,
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Typography
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderItem } from 'src/types/global'
import {
  useInsertOrderItemMutation,
  useUpdateOrderItemByPkMutation
} from 'src/types/graphql-shema'
import { CancelButton, MultilineInput, MyInput, Row } from '../../../shortcuts'

export interface IDialogEditOrderItemProps {
  refetch: () => void
}

export function DialogAddEditOrderItem({ refetch }: IDialogEditOrderItemProps) {
  const {
    orderId,
    addOrderItemDialog: isOpen,
    setAddOrderItemDialog,
    editedOrderItem
  } = useOrderDetailStore()

  const defaultState: Partial<TOrderItem> = {}

  const [state, setState] = useState<Partial<TOrderItem>>(
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
    if (!state.Quantity || !state.Name || !state.OrderItemID) return

    updateMutation({
      variables: {
        id: state.OrderItemID,
        Name: state.Name,
        Quantity: state.Quantity,
        FullName: state.FullName ?? ''
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
    if (!state.Quantity || !state.Name) throw Error()

    insertMutation({
      variables: {
        orderID: orderId,
        name: state.Name,
        quantity: state.Quantity,
        fullName: state.FullName ?? ''
      },
      onCompleted() {
        setState(defaultState)
        refetch()
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const disableSaveButton = !Boolean(state.Name && state.Quantity)
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
            value={state.Name}
            sx={{ mb: '8px' }}
            name="Name"
            onChange={handleInputChange}
          />
          <MultilineInput
            label="Полное наименование"
            sx={{ mb: '8px' }}
            value={state.FullName ?? ''}
            name="FullName"
            onChange={handleInputChange}
          />
          <MyInput
            label="Введите кол-во"
            type="number"
            name="Quantity"
            sx={{ mb: '8px' }}
            value={state.Quantity}
            onChange={handleInputChange}
          />
        </Box>
        <Row gap={2}>
          {!state.OrderItemID ? (
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
