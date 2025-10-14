import { Label, P } from 'lib/index'
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
    Header: 'Деталь/Заказ',
    accessor: data => {
      if (!data.detail_id) return null
      return (
        <>
          {data.manufacturing_order_id && (
            <Label>
              Заказ {data.manufacturing_order_id}
              {' ⇥ '}
              {data.manufacturing_order_qty} шт.
            </Label>
          )}
          <DetailName
            detail={{
              id: data.detail_id,
              name: data.detail_name!,
              group_id: data.detail_group_id!
            }}
            withLink
            withGroupLink
            withParamsButton
          />
        </>
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
