import { Box, Button, Modal, ModalClose, ModalDialog } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { NumberInput } from '@/components/inputs/number_input'
import { CancelButton, InputLabled, MultilineInput, P, Row } from '@/lib/index'
import { orderStore } from '../order.store'

export const InputPositionModal = observer(() => {
  const { positions } = orderStore

  useEffect(() => {
    if (positions.editedOrderItem) {
      positions.openDialog(positions.editedOrderItem)
    }
  }, [positions.editedOrderItem])

  return (
    <Modal
      open={positions.isOpen}
      onClose={() => {
        positions.closeDialog()
      }}
    >
      <ModalDialog minWidth={600}>
        <ModalClose />
        <P level="h4" pb={2}>
          {positions.editedOrderItem ? 'Изменить' : 'Добавить'} позицию
        </P>

        <Box display="flex" flexDirection="column">
          <InputLabled
            fullWidth
            sx={{ width: '100%' }}
            autoFocus
            label="Наименование"
            value={positions.name}
            onChange={v => positions.setName(v)}
          />
          <MultilineInput
            label="Примечание"
            value={positions.description}
            onChange={e => positions.setDescription(e.target.value)}
          />
          <NumberInput
            label="Кол-во"
            type="number"
            value={positions.qty}
            onChange={v => positions.setQty(v)}
          />
        </Box>
        <Row gap={2}>
          {!positions.editedOrderItem?.id ? (
            <Button
              onClick={() =>
                positions
                  .save(orderStore.order!.id)
                  .then(() => orderStore.loadOrder(orderStore.order!.id))
              }
              disabled={!positions.canSave}
            >
              Добавить
            </Button>
          ) : (
            <Button
              onClick={() =>
                positions
                  .save(orderStore.order!.id)
                  .then(() => orderStore.loadOrder(orderStore.order!.id))
              }
            >
              Сохранить
            </Button>
          )}
          <CancelButton onClick={() => positions.closeDialog()} />
        </Row>
      </ModalDialog>
    </Modal>
  )
})
