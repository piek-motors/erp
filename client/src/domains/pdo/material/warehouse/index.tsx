import { Box, Divider, Stack } from '@mui/joy'
import { QtyInputWithUnit } from 'components/inputs'
import { AdaptiveNumberFormatter } from 'domains/pdo/shared/adaptive_number_formatter'
import { value_with_unit } from 'domains/pdo/shared/basic'
import {
  SupplyReasonSelect,
  WriteoffReasonSelect,
} from 'domains/pdo/shared/reason-select'
import {
  SupplyCompletedText,
  WarehouseCard,
  WriteoffCompletedText,
} from 'domains/pdo/warehouse/card'
import { OperationsListModal } from 'domains/pdo/warehouse/modals'
import { modalState } from 'domains/pdo/warehouse/modals.store'
import { ActionButton, Label, observer, P, Row, useParams } from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { uiUnit } from 'models'
import type { MaterialState } from '../state'

interface Props {
  material: MaterialState
  lengthValue: string
  lengthSetValue: (value: string) => void
  reasonComponent: React.ReactNode
  submitDisabled: boolean
  onSubmit: () => Promise<unknown>
  stock?: string
}

const formatter = new AdaptiveNumberFormatter(2)

const CreateWarehouseMaterialOperation = observer(
  ({ material, ...props }: Props) => (
    <Stack spacing={1}>
      <Row flexWrap={'wrap'}>
        <P fontWeight={600} color="primary">
          {material.label || <P color="neutral">Не выбран</P>}
        </P>
        <Divider orientation="vertical" />
        <Label>Остаток</Label>
        {value_with_unit(formatter.format(material.stock), material.unit)}
      </Row>
      <QtyInputWithUnit
        autoFocus
        unitId={material.unit}
        value={props.lengthValue}
        setValue={props.lengthSetValue}
        label={'Длина'}
      />
      {props.reasonComponent}
      <Box pt={2}>
        <ActionButton
          disabled={props.submitDisabled}
          onClick={props.onSubmit}
        />
      </Box>
    </Stack>
  ),
)

export const MaterialWarehouseCard = observer(({ m }: { m: MaterialState }) => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const stock = m.warehouse.on_hand_balance.toFixed(0)
  const stockMsg = `Остаток: ${stock} ${uiUnit(m.unit)}`
  return (
    <WarehouseCard
      stock={value_with_unit(formatter.format(m.stock), m.unit)}
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
