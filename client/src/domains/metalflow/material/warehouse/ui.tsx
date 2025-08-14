import { SupplyReasonSelect } from 'domains/metalflow/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/metalflow/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/metalflow/warehouse/card'
import { observer, useParams } from 'lib/index'
import { uiUnit } from 'models'
import { api } from '../api'
import { CreateWarehouseMaterialOperation } from './create_operation'

export const MaterialWarehouse = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const stockMsg = `Текущий остаток: ${api.s.warehouse.stock} ${uiUnit(
    api.s.unit
  )}`
  return (
    <WarehouseCard
      materialId={materialId}
      stock={api.s.warehouse.stock}
      unit="м"
      supplyModal={
        <CreateWarehouseMaterialOperation
          materialLabel={api.s.label}
          lengthValue={api.s.warehouse.supply.length}
          lengthSetValue={value => api.s.warehouse.supply.setLength(value)}
          reasonComponent={
            <SupplyReasonSelect
              reason={api.s.warehouse.supply.reason}
              setReason={reason => api.s.warehouse.supply.setReason(reason)}
            />
          }
          submitDisabled={api.s.warehouse.supply.disabled()}
          onSubmit={() => api.s.warehouse.insertSupply(api.s.id!)}
          stock={stockMsg}
        />
      }
      writeoffModal={
        <CreateWarehouseMaterialOperation
          materialLabel={api.s.label}
          lengthValue={api.s.warehouse.writeoff.length}
          lengthSetValue={value => api.s.warehouse.writeoff.setLength(value)}
          reasonComponent={
            <WriteoffReasonSelect
              reason={api.s.warehouse.writeoff.reason}
              setReason={reason => api.s.warehouse.writeoff.setReason(reason)}
            />
          }
          submitDisabled={api.s.warehouse.writeoff.disabled()}
          onSubmit={() => api.s.warehouse.insertWriteoff(api.s.id!)}
          stock={stockMsg}
        />
      }
    />
  )
})
