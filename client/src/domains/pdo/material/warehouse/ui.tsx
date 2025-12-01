import { SupplyReasonSelect } from 'domains/pdo/shared/supply-reason-select'
import { WriteoffReasonSelect } from 'domains/pdo/shared/writeoff-reason-select'
import {
  SupplyCompletedText,
  WarehouseCard,
  WriteoffCompletedText
} from 'domains/pdo/warehouse/card'
import { OperationsListModal } from 'domains/pdo/warehouse/modals'
import { observer, useParams } from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { uiUnit } from 'models'
import { MaterialState } from '../state'

import { Stack } from '@mui/joy'
import { QtyInputWithUnit } from 'domains/pdo/shared'
import { modalState } from 'domains/pdo/warehouse/modals.store'
import { ActionButton, Label, P, Row } from 'lib/index'

interface Props {
  material: MaterialState
  lengthValue: string
  lengthSetValue: (value: string) => void
  reasonComponent: React.ReactNode
  submitDisabled: boolean
  onSubmit: () => Promise<unknown>
  stock?: string
}

const CreateWarehouseMaterialOperation = observer((props: Props) => (
  <Stack spacing={1} p={1}>
    <Row sx={{ fontSize: 20 }}>
      <Label>Материал: </Label>
      <P fontWeight={600} color="primary">
        {props.material.label || <P color="neutral">Не выбран</P>}
      </P>
    </Row>
    {props.stock && <P level="body-sm">{props.stock}</P>}
    <QtyInputWithUnit
      autoFocus
      unitId={props.material.unit}
      value={props.lengthValue}
      setValue={props.lengthSetValue}
      label={'Длина'}
    />
    {props.reasonComponent}
    <ActionButton disabled={props.submitDisabled} onClick={props.onSubmit} />
  </Stack>
))

export const MaterialWarehouse = observer(({ m }: { m: MaterialState }) => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const stock = m.warehouse.stock.toFixed(0)
  const stockMsg = `Остаток: ${stock} ${uiUnit(m.unit)}`
  return (
    <WarehouseCard
      stock={m.warehouse.stock}
      unit={uiUnit(m.unit)}
      supply={
        <CreateWarehouseMaterialOperation
          material={m}
          lengthValue={m.warehouse.supply.length}
          lengthSetValue={value => m.warehouse.supply.setLength(value)}
          reasonComponent={
            <SupplyReasonSelect
              reason={m.warehouse.supply.reason}
              setReason={reason => m.warehouse.supply.setReason(reason)}
            />
          }
          submitDisabled={m.warehouse.supply.disabled()}
          onSubmit={() =>
            m.warehouse
              .insertSupply(m.id!)
              .then(() => {
                notifier.ok(SupplyCompletedText)
              })
              .finally(() => {
                modalState.setSupply(false)
              })
          }
          stock={stockMsg}
        />
      }
      writeoff={
        <CreateWarehouseMaterialOperation
          material={m}
          lengthValue={m.warehouse.writeoff.length}
          lengthSetValue={value => m.warehouse.writeoff.setLength(value)}
          reasonComponent={
            <WriteoffReasonSelect
              reason={m.warehouse.writeoff.reason}
              setReason={reason => m.warehouse.writeoff.setReason(reason)}
            />
          }
          submitDisabled={m.warehouse.writeoff.disabled()}
          onSubmit={() =>
            m.warehouse
              .insertWriteoff(m.id!)
              .then(() => {
                notifier.ok(WriteoffCompletedText)
              })
              .finally(() => {
                modalState.setWriteoff(false)
              })
          }
          stock={stockMsg}
        />
      }
    >
      <OperationsListModal materialId={materialId} />
    </WarehouseCard>
  )
})
