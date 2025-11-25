import { Button, Label, Link, openPage, P, routeMap } from 'lib/index'
import {
  OperationType,
  SupplyReason,
  uiSupplyReason,
  uiUnit,
  uiWriteoffReason,
  WriteoffReason
} from 'models'
import { Column } from 'react-table'
import { DetailName } from '../detail/name'
import { OperationName } from './operation_name'
import { Operation } from './store'

export const columns: Column<Operation>[] = [
  {
    Header: 'Дата',
    accessor: data => <P whiteSpace={'nowrap'}>{data.timestamp}</P>
  },
  {
    Header: `Объект`,
    id: 'name',
    accessor: data => <OperationName operation={data} showLinkButton={true} />
  },
  {
    Header: 'Кол-во',
    accessor: data => {
      const unit = data.material_id != null ? uiUnit(data.unit) : ''
      const sign = data.operation_type == OperationType.Supply ? '+' : '-'
      return (
        <P>
          {sign} {data.qty} {unit}
        </P>
      )
    }
  },
  {
    Header: 'Заказ',
    accessor: data =>
      data.manufacturing_order_id && (
        <Link
          to={openPage(
            routeMap.pdo.manufacturing_order.edit,
            data.manufacturing_order_id
          )}
        >
          <Button
            variant="outlined"
            size="sm"
            color="neutral"
            sx={{
              fontWeight: 'normal',
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
              p: 0.5
            }}
          >
            №{data.manufacturing_order_id} {' ⇥ '}
            {data.manufacturing_order_qty} шт.
          </Button>
        </Link>
      )
  },
  {
    Header: 'Деталь',
    accessor: data => {
      if (!data.detail_id) return null
      return (
        <DetailName
          sx={{ whiteSpace: 'wrap', width: 'auto' }}
          detail={{
            id: data.detail_id,
            name: data.detail_name!,
            group_id: data.detail_group_id!
          }}
          withLink
          withGroupLink
        />
      )
    }
  },
  {
    Header: 'Тип операции',
    accessor: data => {
      const isSupply = Number(data.operation_type) === OperationType.Supply
      const op = isSupply
        ? uiSupplyReason(data?.reason as SupplyReason)
        : uiWriteoffReason(data?.reason as WriteoffReason)
      return <Label xs>{op}</Label>
    }
  },
  {
    Header: '№',
    accessor: o => <Label xs>{o.id}</Label>
  }
]
