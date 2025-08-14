import { SupplyReasonSelect } from 'domains/metalflow/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/metalflow/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/metalflow/warehouse/shared/card'
import { observer, useParams } from 'lib/index'
import { uiUnit } from 'models'
import { material } from '../store'
import { CreateWarehouseMaterialOperation } from './create_operation'

export const MaterialWarehouse = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const stockMsg = `Текущий остаток: ${material.warehouse.stock} ${uiUnit(
    material.unit
  )}`
  return (
    <WarehouseCard
      materialId={materialId}
      stock={material.warehouse.stock}
      unit="м"
      supplyModal={
        <CreateWarehouseMaterialOperation
          materialLabel={material.label}
          lengthValue={material.warehouse.supply.length}
          lengthSetValue={value => material.warehouse.supply.setLength(value)}
          reasonComponent={
            <SupplyReasonSelect
              reason={material.warehouse.supply.reason}
              setReason={reason => material.warehouse.supply.setReason(reason)}
            />
          }
          submitDisabled={material.warehouse.supply.disabled()}
          onSubmit={() => material.warehouse.insertSupply(material.id!)}
          stock={stockMsg}
        />
      }
      writeoffModal={
        <CreateWarehouseMaterialOperation
          materialLabel={material.label}
          lengthValue={material.warehouse.writeoff.length}
          lengthSetValue={value => material.warehouse.writeoff.setLength(value)}
          reasonComponent={
            <WriteoffReasonSelect
              reason={material.warehouse.writeoff.reason}
              setReason={reason =>
                material.warehouse.writeoff.setReason(reason)
              }
            />
          }
          submitDisabled={material.warehouse.writeoff.disabled()}
          onSubmit={() => material.warehouse.insertWriteoff(material.id!)}
          stock={stockMsg}
        />
      }
    />
  )
})
