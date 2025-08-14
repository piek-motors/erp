import { SupplyReasonSelect } from 'domains/metalflow/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/metalflow/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/metalflow/warehouse/card'
import { ExecuteAction, Inp, Label, observer, P } from 'lib/index'
import { api } from '../api'

const CreateWarehouseDetailOperation = observer(
  (props: {
    reasonComponent: React.ReactNode
    onSubmit: () => Promise<unknown>
  }) => {
    return (
      <>
        <P>
          <Label>Деталь:</Label> {api.detail.name}
        </P>
        <P>
          <Label>Остаток:</Label> {api.detail.warehouse.stock} шт
        </P>
        <Inp
          label="Кол-во"
          autoFocus
          type="number"
          sx={{ width: '100px' }}
          value={api.detail.warehouse.qty}
          onChange={val => api.detail.warehouse.setQty(Number(val))}
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
      detailId={api.detail.id}
      stock={api.detail.warehouse.stock}
      unit="шт"
      writeoffModal={
        <CreateWarehouseDetailOperation
          reasonComponent={
            <WriteoffReasonSelect
              reason={api.detail.warehouse.writeoff.reason}
              setReason={reason =>
                api.detail.warehouse.writeoff.setReason(reason)
              }
            />
          }
          onSubmit={() => api.detail.warehouse.insertWriteoff(api.detail.id!)}
        />
      }
      supplyModal={
        <CreateWarehouseDetailOperation
          reasonComponent={
            <SupplyReasonSelect
              reason={api.detail.warehouse.supply.reason}
              setReason={reason =>
                api.detail.warehouse.supply.setReason(reason)
              }
            />
          }
          onSubmit={() => api.detail.warehouse.insertSupply(api.detail.id!)}
        />
      }
    />
  )
})
