import { UilHistory } from '@iconscout/react-unicons'
import { IconButton } from '@mui/joy'
import {
  OperationType,
  type SupplyReason,
  time,
  uiSupplyReason,
  uiWriteoffReason,
  type WriteoffReason,
} from 'models'
import type { Column } from 'react-table'
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
import { AdaptiveNumberFormatter } from '../shared/adaptive_number_formatter'
import { value_with_unit } from '../shared/basic'
import { type Operation, operations_st } from './list'
import { MaterialName } from '../material/name'

const formatter = new AdaptiveNumberFormatter(2)
const ShowRevertButtonWithinDays = 7

const date_col = {
  Header: 'Дата',
  accessor: data => (
    <Label level="body-xs" whiteSpace={'nowrap'}>
      {time.fmt_relative_or_calendar_date(data.timestamp)}
    </Label>
  ),
}

const revert_col = {
  Header: 'Откат',
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
        onClick={() => operations_st.revert(op)}
      >
        <UseIcon icon={UilHistory} small invert />
      </IconButton>
    )
  },
}

const op_type_col = {
  Header: 'Тип операции',
  accessor: data => {
    const isSupply = Number(data.operation_type) === OperationType.Supply
    const op = isSupply
      ? uiSupplyReason(data?.reason as SupplyReason)
      : uiWriteoffReason(data?.reason as WriteoffReason)
    return <Label xs>{op}</Label>
  },
}

export const material_columns: Column<Operation>[] = [
  date_col,
  {
    Header: `Материал`,
    id: 'name',
    accessor: data => (
      <MaterialName label={data.material_label} id={data.material_id} />
    ),
  },
  {
    Header: 'Кол-во',
    accessor: data => {
      const sign = data.operation_type === OperationType.Supply ? '+' : '-'
      return (
        <Row flexWrap={'nowrap'} gap={0.3}>
          <Label>{sign}</Label>{' '}
          {value_with_unit(formatter.format(data.qty), data.unit)}
        </Row>
      )
    },
  },
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

export const detail_columns: Column<Operation>[] = [
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
  {
    Header: 'Кол-во',
    accessor: data => {
      const sign = data.operation_type === OperationType.Supply ? '+' : '-'
      return (
        <Row flexWrap={'nowrap'} gap={0.3}>
          <Label>{sign}</Label>{' '}
          {value_with_unit(formatter.format(data.qty), data.unit)}
        </Row>
      )
    },
  },
  op_type_col,
  revert_col,
]
