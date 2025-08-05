import { SupplyReasonSelect } from 'domains/metalflow/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/metalflow/shared/writeoff-reason-select'
import { WarehouseCard } from 'domains/metalflow/warehouse/shared/card'
import { observer, useParams } from 'lib/index'
import { material } from '../material.store'
import { CreateWarehouseMaterialOperation } from './create_operation'

export const MaterialWarehouse = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  return (
    <WarehouseCard
      materialId={materialId}
      stock={material.stock}
      unit="м"
      supplyModal={
        <CreateWarehouseMaterialOperation
          materialLabel={material.label}
          lengthValue={material.supply.length}
          lengthSetValue={value => material.supply.setLength(value)}
          reasonComponent={
            <SupplyReasonSelect
              reason={material.supply.reason}
              setReason={reason => material.supply.setReason(reason)}
            />
          }
          submitDisabled={material.supply.disabled()}
          onSubmit={() => material.insertSupply()}
        />
      }
      writeoffModal={
        <CreateWarehouseMaterialOperation
          materialLabel={material.label}
          lengthValue={material.writeoff.length}
          lengthSetValue={value => material.writeoff.setLength(value)}
          reasonComponent={
            <WriteoffReasonSelect
              reason={material.writeoff.reason}
              setReason={reason => material.writeoff.setReason(reason)}
            />
          }
          submitDisabled={material.writeoff.disabled()}
          onSubmit={() => material.insertWriteoff()}
        />
      }
    />
  )
})
