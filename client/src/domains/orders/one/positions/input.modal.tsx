import { Box, Button, Modal, ModalClose, ModalDialog } from '@mui/joy'
import { CancelButton, Inp, MultilineInput, P, Row } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { orderStore } from '../stores/order.store'

export const InputPositionModal = observer(() => {
  useEffect(() => {
    if (orderStore.positions.editedOrderItem) {
      orderStore.positions.openDialog(orderStore.positions.editedOrderItem)
    }
  }, [orderStore.positions.editedOrderItem])

  return (
    <Modal
      open={orderStore.positions.isOpen}
      onClose={() => {
        orderStore.positions.closeDialog()
      }}
    >
      <ModalDialog minWidth={600}>
        <ModalClose />
        <P level="h4" pb={2}>
          {orderStore.positions.editedOrderItem ? 'Изменить' : 'Добавить'}{' '}
          позицию
        </P>

        <Box display="flex" flexDirection="column">
          <Inp
            fullWidth
            autoFocus
            label="Наименование"
            value={orderStore.positions.name}
            onChange={v => orderStore.positions.setName(v)}
          />
          <MultilineInput
            label="Примечание"
            value={orderStore.positions.description}
            onChange={e => orderStore.positions.setDescription(e.target.value)}
          />
          <Inp
            label="Количество"
            type="number"
            value={orderStore.positions.quantity?.toString() ?? ''}
            onChange={v => orderStore.positions.setQuantity(v)}
          />
        </Box>
        <Row gap={2}>
          {!orderStore.positions.editedOrderItem?.id ? (
            <Button
              onClick={() => orderStore.positions.save(orderStore.order!.id)}
              disabled={!orderStore.positions.canSave}
            >
              Добавить
            </Button>
          ) : (
            <Button
              onClick={() => orderStore.positions.save(orderStore.order!.id)}
            >
              Сохранить
            </Button>
          )}
          <CancelButton
            onClick={() => {
              orderStore.positions.closeDialog()
            }}
          />
        </Row>
      </ModalDialog>
    </Modal>
  )
})
