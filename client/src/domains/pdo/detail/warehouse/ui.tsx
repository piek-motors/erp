import { NumberInput } from 'components/inputs/number_input'
import { SupplyReasonSelect } from 'domains/pdo/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/pdo/shared/writeoff-reason-select'
import {
  SupplyCompletedText,
  WarehouseCard,
  WriteoffCompletedText
} from 'domains/pdo/warehouse/card'
import { OperationsListModal } from 'domains/pdo/warehouse/modals'
import { modalState } from 'domains/pdo/warehouse/modals.store'
import { ActionButton, Label, observer, P } from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { DetailState } from '../detail.state'

const CreateWarehouseDetailOperation = observer(
  (props: {
    detail: DetailState
    reasonComponent: React.ReactNode
    onSubmit: () => Promise<unknown>
  }) => {
    const { detail } = props
    return (
      <>
        <P>
          <Label>Деталь:</Label> {detail.name}
        </P>
        <P>
          <Label>Остаток:</Label> {detail.warehouse.stock} шт
        </P>
        <NumberInput
          label="Кол-во"
          autoFocus
          type="number"
          sx={{ width: '100px' }}
          value={detail.warehouse.qty}
          onChange={val => detail.warehouse.setQty(Number(val))}
        />
        {props.reasonComponent}
        <ActionButton
          onClick={() => props.onSubmit()}
          disabled={!detail.warehouse.qty}
        />
      </>
    )
  }
)

export const DetailWarehouse = observer(
  ({ detail }: { detail: DetailState }) => {
    return (
      <WarehouseCard
        stock={detail.warehouse.stock}
        unit="шт"
        writeoff={
          <CreateWarehouseDetailOperation
            detail={detail}
            reasonComponent={
              <WriteoffReasonSelect
                reason={detail.warehouse.writeoff.reason}
                setReason={reason =>
                  detail.warehouse.writeoff.setReason(reason)
                }
              />
            }
            onSubmit={() =>
              detail.warehouse
                .insertWriteoff(detail.id)
                .then(() => {
                  notifier.ok(WriteoffCompletedText)
                })
                .catch(e => {
                  notifier.err(`Ошибка списания детали: ${e.message}`)
                  throw e
                })
                .finally(() => {
                  modalState.setWriteoff(false)
                })
            }
          />
        }
        supply={
          <CreateWarehouseDetailOperation
            detail={detail}
            reasonComponent={
              <SupplyReasonSelect
                reason={detail.warehouse.supply.reason}
                setReason={reason => detail.warehouse.supply.setReason(reason)}
              />
            }
            onSubmit={() =>
              detail.warehouse
                .insertSupply(detail.id)
                .then(() => {
                  notifier.ok(SupplyCompletedText)
                })
                .catch(e => {
                  notifier.err(`Ошибка при регистрации поставки: ${e.message}`)
                  throw e
                })
                .finally(() => {
                  modalState.setSupply(false)
                })
            }
          />
        }
      >
        <OperationsListModal detailId={detail.id} />
      </WarehouseCard>
    )
  }
)
