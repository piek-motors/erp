import { SupplyReasonSelect } from 'domains/pdo/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/pdo/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/pdo/warehouse/card'
import { ExecuteAction, Inp, Label, observer, P } from 'lib/index'
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
        <Inp
          label="Кол-во"
          autoFocus
          type="number"
          sx={{ width: '100px' }}
          value={detail.warehouse.qty}
          onChange={val => detail.warehouse.setQty(Number(val))}
        />
        {props.reasonComponent}
        <ExecuteAction onSubmit={() => props.onSubmit()} />
      </>
    )
  }
)

export const DetailWarehouse = observer(
  ({ detail }: { detail: DetailState }) => {
    return (
      <WarehouseCard
        detailId={detail.id}
        stock={detail.warehouse.stock}
        unit="шт"
        writeoffModal={
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
            onSubmit={() => detail.warehouse.insertWriteoff(detail.id)}
          />
        }
        supplyModal={
          <CreateWarehouseDetailOperation
            detail={detail}
            reasonComponent={
              <SupplyReasonSelect
                reason={detail.warehouse.supply.reason}
                setReason={reason => detail.warehouse.supply.setReason(reason)}
              />
            }
            onSubmit={() => detail.warehouse.insertSupply(detail.id)}
          />
        }
      />
    )
  }
)
