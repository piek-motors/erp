import { ExecuteAction, Inp, observer, P } from 'lib/index'
import { SupplyReasonSelect } from 'metalflow/materials/warehouse/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'metalflow/materials/warehouse/shared/writeoff-reason-select'
import { WarehouseCard } from 'metalflow/warehouse/shared/card'
import { detailStore } from '../detail.store'

const CreateWarehouseOperation = observer(
  (props: {
    reasonComponent: React.ReactNode
    submitDisabled: boolean
    onSubmit: () => Promise<unknown>
  }) => {
    return (
      <>
        <P>Деталь: {detailStore.name}</P>
        <P>Остаток: {detailStore.stock} шт</P>
        <Inp
          label="Кол-во"
          autoFocus
          type="number"
          value={detailStore.warehouse.qty}
          onChange={val => detailStore.warehouse.setQty(Number(val))}
        />
        {props.reasonComponent}
        <ExecuteAction
          disabled={props.submitDisabled}
          onSubmit={props.onSubmit}
        />
      </>
    )
  }
)

export const DetailWarehouse = observer(() => {
  return (
    <WarehouseCard
      detailId={detailStore.id}
      stock={detailStore.stock}
      unit="шт"
      writeoffModal={
        <CreateWarehouseOperation
          reasonComponent={
            <WriteoffReasonSelect
              reason={detailStore.warehouse.writeoff.reason}
              setReason={reason =>
                detailStore.warehouse.writeoff.setReason(reason)
              }
            />
          }
          submitDisabled={false}
          onSubmit={() =>
            detailStore.warehouse.insertWriteoff(detailStore.id!).then(() => {
              detailStore.loadFullInfo(detailStore.id!)
            })
          }
        />
      }
      supplyModal={
        <CreateWarehouseOperation
          reasonComponent={
            <SupplyReasonSelect
              reason={detailStore.warehouse.supply.reason}
              setReason={reason =>
                detailStore.warehouse.supply.setReason(reason)
              }
            />
          }
          submitDisabled={false}
          onSubmit={() =>
            detailStore.warehouse.insertSupply(detailStore.id!).then(() => {
              detailStore.loadFullInfo(detailStore.id!)
            })
          }
        />
      }
    />
  )
})
