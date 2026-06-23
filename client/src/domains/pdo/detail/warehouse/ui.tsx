import { Stack } from '@mui/joy'
import {
  SupplyReason,
  Unit,
  uiSupplyReason,
  uiWriteoffReason,
  WriteoffReason,
} from 'shared'
import { NumberInput } from '@/components/inputs/number_input'
import { AdaptiveNumberFormatter } from '@/domains/pdo/shared/adaptive_number_formatter'
import { value_with_unit } from '@/domains/pdo/shared/basic'
import { ReasonSelect } from '@/domains/pdo/shared/reason-select'
import {
  SupplyCompletedText,
  WriteoffCompletedText,
} from '@/domains/pdo/warehouse/card'
import {
  OperationModal,
  OperationsListModal,
} from '@/domains/pdo/warehouse/modals'
import { inventory_log_modal } from '@/domains/pdo/warehouse/modals_vm'
import { ActionButton, Box, Btn, Label, observer, P, Row } from '@/lib/index'
import { notifier } from '@/lib/store/notifier.store'
import type { DetailSt, DetailStProp } from '../detail.state'

const formatter = new AdaptiveNumberFormatter(0)

const CreateWarehouseDetailOperation = observer(
  (props: {
    detail: DetailSt
    reasonComponent: React.ReactNode
    submitDisabled: boolean
    onSubmit: () => Promise<unknown>
  }) => {
    const { detail } = props
    return (
      <>
        <Row>
          <P>{detail.name}</P>
          <Label>Остаток</Label>{' '}
          {value_with_unit(
            formatter.format(detail.warehouse.stock),
            Unit.Countable,
          )}
        </Row>
        <NumberInput
          label="Кол-во"
          autoFocus
          type="number"
          sx={{ width: '100px' }}
          value={detail.warehouse.qty}
          onChange={val => detail.warehouse.setQty(val)}
        />
        {props.reasonComponent}
        <Box pt={2}>
          <ActionButton
            onClick={() => props.onSubmit()}
            disabled={!detail.warehouse.qty || props.submitDisabled}
          />
        </Box>
      </>
    )
  },
)

const supply_text = 'Поставка'
const writeoff_text = 'Списание'

const SupplyContent = observer(({ detail }: DetailStProp) => (
  <CreateWarehouseDetailOperation
    detail={detail}
    reasonComponent={
      <ReasonSelect
        reasons={[
          SupplyReason.ProductionOutput,
          SupplyReason.Purchase,
          SupplyReason.StockCorrection,
        ]}
        reason={detail.warehouse.supply.reason}
        setReason={reason => detail.warehouse.supply.setReason(reason)}
        getReasonLabel={uiSupplyReason}
      />
    }
    submitDisabled={detail.warehouse.supply.reason == null}
    onSubmit={() =>
      detail.warehouse
        .insertSupply(detail.id)
        .then(() => {
          notifier.ok(SupplyCompletedText)
        })
        .catch(e => {
          notifier.err(e)
        })
        .finally(() => {
          inventory_log_modal.setSupply(false)
        })
    }
  />
))

const WriteoffContent = observer(({ detail }: DetailStProp) => (
  <CreateWarehouseDetailOperation
    detail={detail}
    reasonComponent={
      <ReasonSelect
        reasons={[
          WriteoffReason.ProductionUse,
          WriteoffReason.StockCorrection,
          WriteoffReason.DefectLoss,
          WriteoffReason.Sale,
        ]}
        reason={detail.warehouse.writeoff.reason}
        setReason={reason => detail.warehouse.writeoff.setReason(reason)}
        getReasonLabel={uiWriteoffReason}
      />
    }
    submitDisabled={detail.warehouse.writeoff.reason == null}
    onSubmit={() =>
      detail.warehouse
        .insertWriteoff(detail.id)
        .then(() => {
          notifier.ok(WriteoffCompletedText)
        })
        .catch(e => {
          notifier.err(e)
        })
        .finally(() => {
          inventory_log_modal.setWriteoff(false)
        })
    }
  />
))

export const DetailWarehouseButtons = observer(({ detail }: DetailStProp) => (
  <Stack gap={1.5}>
    <Row gap={1}>
      <Row gap={1}>
        <img
          src="/icons/warehouse.svg"
          width={15}
          height={15}
          style={{ opacity: 0.5 }}
        />
        {value_with_unit(
          formatter.format(detail.warehouse.stock),
          Unit.Countable,
        )}
      </Row>
      <OperationModal
        openButton={
          <Btn variant="soft" color="success" fullWidth size="sm">
            {supply_text}
          </Btn>
        }
        open={inventory_log_modal.supply}
        setOpen={o => inventory_log_modal.setSupply(o)}
      >
        <P color="success" fontWeight={600}>
          {supply_text}
        </P>
        <Stack gap={1} my={1}>
          <SupplyContent detail={detail} />
        </Stack>
      </OperationModal>

      <OperationModal
        openButton={
          <Btn variant="soft" color="warning" size="sm">
            {writeoff_text}
          </Btn>
        }
        open={inventory_log_modal.writeoff}
        setOpen={o => inventory_log_modal.setWriteoff(o)}
      >
        <P color="warning" fontWeight={600}>
          {writeoff_text}
        </P>
        <Stack gap={1} my={1}>
          <WriteoffContent detail={detail} />
        </Stack>
      </OperationModal>
      <OperationsListModal detailId={detail.id} />
    </Row>
  </Stack>
))
