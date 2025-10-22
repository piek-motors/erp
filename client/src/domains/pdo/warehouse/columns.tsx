import { Button, Link, openPage, P, routeMap } from 'lib/index'
import {
  EnOperationType,
  EnSupplyReason,
  EnWriteoffReason,
  uiSupplyReason,
  uiWriteoffReason
} from 'models'
import { Column } from 'react-table'
import { DetailName } from '../detail/name'
import { OperationName } from './operation_name'
import { Operation } from './store'

export const columns: Column<Operation>[] = [
  {
    Header: '№',
    accessor: 'id'
  },

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
    accessor: data => <P>{data.qty}</P>
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
          withParamsButton
        />
      )
    }
  },
  {
    Header: 'Тип операции',
    accessor: data => {
      const isSupply = Number(data.operation_type) === EnOperationType.Supply
      return isSupply
        ? uiSupplyReason(data?.reason as EnSupplyReason)
        : uiWriteoffReason(data?.reason as EnWriteoffReason)
    }
  }
]
