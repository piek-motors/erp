import { SupplyReasonSelect } from 'domains/metalflow/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/metalflow/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/metalflow/warehouse/shared/card'
import { ExecuteAction, Inp, Label, observer, P } from 'lib/index'
import { detailStore } from '../store'

const CreateWarehouseDetailOperation = observer(
  (props: {
    reasonComponent: React.ReactNode
    onSubmit: () => Promise<unknown>
  }) => {
    return (
      <>
        <P>
          <Label>Деталь:</Label> {detailStore.name}
        </P>
        <P>
          <Label>Остаток:</Label> {detailStore.warehouse.stock} шт
        </P>
        <Inp
          label="Кол-во"
          autoFocus
          type="number"
          sx={{ width: '100px' }}
          value={detailStore.warehouse.qty}
          onChange={val => detailStore.warehouse.setQty(Number(val))}
        />
        {props.reasonComponent}
        <ExecuteAction onSubmit={() => props.onSubmit()} />
      </>
    )
  }
)

export const DetailWarehouse = observer(() => {
  return (
    <WarehouseCard
      detailId={detailStore.id}
      stock={detailStore.warehouse.stock}
      unit="шт"
      writeoffModal={
        <CreateWarehouseDetailOperation
          reasonComponent={
            <WriteoffReasonSelect
              reason={detailStore.warehouse.writeoff.reason}
              setReason={reason =>
                detailStore.warehouse.writeoff.setReason(reason)
              }
            />
          }
          onSubmit={() => detailStore.warehouse.insertWriteoff(detailStore.id!)}
        />
      }
      supplyModal={
        <CreateWarehouseDetailOperation
          reasonComponent={
            <SupplyReasonSelect
              reason={detailStore.warehouse.supply.reason}
              setReason={reason =>
                detailStore.warehouse.supply.setReason(reason)
              }
            />
          }
          onSubmit={() => detailStore.warehouse.insertSupply(detailStore.id!)}
        />
      }
    />
  )
})
