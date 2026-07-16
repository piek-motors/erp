import { HistoryRounded } from '@mui/icons-material'
import { Chip, IconButton } from '@mui/joy'
import type { Column } from 'react-table'
import {
  OperationType,
  SupplyReason,
  time,
  uiSupplyReason,
  uiWriteoffReason,
  WriteoffReason,
} from 'shared'
import { Day } from '@/lib/constants'
import {
  Button,
  Label,
  Link,
  openPage,
  Row,
  routeMap,
  UseIcon,
} from '@/lib/index'
import { GroupAssigment } from '../detail/detail.state'
import { DetailName } from '../detail/detail_name'
import { MaterialName } from '../material/name'
import { AdaptiveNumberFormatter } from '../shared/adaptive_number_formatter'
import { value_with_unit } from '../shared/basic'
import type { InventoryLogRecord } from './inventory_log'
import { inventory_log_vm } from './inventory_log_vm'

const formatter = new AdaptiveNumberFormatter(2)
const ShowRevertButtonWithinDays = 7

const reason_chip_colors: Record<
  string,
  { backgroundColor: string; color: string }
> = {
  [`${OperationType.Supply}:${SupplyReason.Purchase}`]: {
    backgroundColor: '#d8f3dc',
    color: '#155d27',
  },
  [`${OperationType.Supply}:${SupplyReason.ProductionOutput}`]: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  [`${OperationType.Supply}:${SupplyReason.StockCorrection}`]: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
  },
  [`${OperationType.Writeoff}:${WriteoffReason.ProductionUse}`]: {
    backgroundColor: '#ffedd5',
    color: '#9a3412',
  },
  [`${OperationType.Writeoff}:${WriteoffReason.DefectLoss}`]: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  [`${OperationType.Writeoff}:${WriteoffReason.StockCorrection}`]: {
    backgroundColor: '#cffafe',
    color: '#155e75',
  },
  [`${OperationType.Writeoff}:${WriteoffReason.Sale}`]: {
    backgroundColor: '#fce7f3',
    color: '#9d174d',
  },
}

const date_col = {
  Header: 'Дата',
  accessor: data => (
    <Label level="body-xs" whiteSpace={'nowrap'}>
      {time.fmt_relative_or_calendar_date(data.timestamp)}
    </Label>
  ),
}

const revert_col = {
  Header: 'Отмена',
  accessor: op => {
    const cutoffDate = new Date(Date.now() - ShowRevertButtonWithinDays * Day)
    if (new Date(op.timestamp) < cutoffDate) return null
    return (
      <IconButton
        size="sm"
        variant="solid"
        color="danger"
        sx={{
          '--IconButton-size': '20px',
          opacity: 0.05,
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={() => inventory_log_vm.revert(op)}
      >
        <UseIcon icon={HistoryRounded} small invert />
      </IconButton>
    )
  },
}

const op_type_col = {
  Header: 'Основание',
  accessor: data => {
    const isSupply = Number(data.operation_type) === OperationType.Supply
    const op = isSupply
      ? uiSupplyReason(data?.reason as SupplyReason)
      : uiWriteoffReason(data?.reason as WriteoffReason)
    const reason_color =
      reason_chip_colors[
        `${isSupply ? OperationType.Supply : OperationType.Writeoff}:${data.reason}`
      ]
    return (
      <Chip size="sm" variant="soft" color="neutral" sx={reason_color}>
        {op}
      </Chip>
    )
  },
}

const balance_change_col = {
  Header: 'Изм. остатка',
  accessor: data => {
    const is_supply = data.operation_type === OperationType.Supply
    const sign = is_supply ? '+' : '-'
    return (
      <Row
        flexWrap={'nowrap'}
        gap={0.3}
        sx={{
          background: is_supply ? '#c4dcc289' : '#e9b4b179',
          borderRadius: 20,
          width: 'fit-content',
          px: 0.8,
        }}
      >
        <Label sx={{ fontWeight: 300 }}>{sign}</Label>
        {value_with_unit(formatter.format(data.qty), data.unit)}
      </Row>
    )
  },
}

export const material_columns: Column<InventoryLogRecord>[] = [
  date_col,
  {
    Header: `Материал`,
    id: 'name',
    accessor: data =>
      data.material && <MaterialName material={data.material} />,
  },
  balance_change_col,
  {
    Header: 'Деталь',
    accessor: data => {
      return (
        <DetailName
          slot_props={{ name: { whiteSpace: 'wrap', width: 'auto' } }}
          detail={{
            id: data.detail_id,
            name: data.detail_name,
            group_assigment: new GroupAssigment(data.detail_group_ids),
          }}
          with_group_name
        />
      )
    },
  },
  {
    Header: 'Заказ',
    accessor: data =>
      data.manufacturing_order_id && (
        <Link
          to={openPage(routeMap.pdo.order.edit, data.manufacturing_order_id)}
        >
          <Button
            variant="outlined"
            size="sm"
            color="neutral"
            sx={{
              minHeight: '15px',
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
              p: 0.5,
            }}
          >
            №{data.manufacturing_order_id} {' ⇥ '}
            {data.manufacturing_order_qty} шт.
          </Button>
        </Link>
      ),
  },
  op_type_col,
  revert_col,
]

export const detail_columns: Column<InventoryLogRecord>[] = [
  date_col,
  {
    Header: `Деталь`,
    id: 'name',
    accessor: data => (
      <DetailName
        detail={{
          id: data.detail_id,
          name: data.detail_name,
          group_assigment: new GroupAssigment(data.detail_group_ids),
        }}
        with_group_name
      />
    ),
  },
  balance_change_col,
  op_type_col,
  revert_col,
]
