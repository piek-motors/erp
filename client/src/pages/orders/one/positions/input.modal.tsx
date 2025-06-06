import * as joy from '@mui/joy'
import { CancelButton, Inp, MultilineInput, Row } from 'lib/shortcuts'
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
    <joy.Modal
      open={orderStore.positions.isOpen}
      onClose={() => {
        orderStore.positions.closeDialog()
      }}
    >
      <joy.ModalDialog minWidth={600}>
        <joy.ModalClose />
        <joy.Typography level="h4" pb={2}>
          {orderStore.positions.editedOrderItem ? 'Изменить' : 'Добавить'}{' '}
          позицию
        </joy.Typography>

        <joy.Box display="flex" flexDirection="column">
          <Inp
            fullWidth
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
        </joy.Box>
        <Row gap={2}>
          {!orderStore.positions.editedOrderItem?.id ? (
            <joy.Button
              onClick={() => orderStore.positions.save(orderStore.order!.id)}
              disabled={!orderStore.positions.canSave}
            >
              Добавить
            </joy.Button>
          ) : (
            <joy.Button
              onClick={() => orderStore.positions.save(orderStore.order!.id)}
            >
              Сохранить
            </joy.Button>
          )}
          <CancelButton
            onClick={() => {
              orderStore.positions.closeDialog()
            }}
          />
        </Row>
      </joy.ModalDialog>
    </joy.Modal>
  )
})
