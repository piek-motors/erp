import { Column } from 'react-table'
import { formatUnit, formatWriteoffReason } from 'shared'
import { EnWriteoffType } from 'shared/enumerations'
import { formatDateWithTime } from '../../../lib/date'
import { GetWrietOffsQuery } from '../../../types/graphql-shema'
import { MaterialName } from '../shared/material-name'
import { t } from '../text'
import { DeleteWrireOff } from './writeoff.delete'

export type SupplyDto = GetWrietOffsQuery['metal_pdo_writeoffs'][number]

export function getColumns(props: {
  key: number
  setKey: (n: number) => void
  refetch: () => void
}): Column<SupplyDto>[] {
  return [
    {
      Header: 'Id',
      accessor: 'id'
    },
    {
      Header: t.Material,
      id: 'name',
      accessor: data => (
        <MaterialName
          shape={data.material?.shape}
          shapeData={data.material?.shape_data}
        />
      )
    },
    {
      Header: 'Кол-во',
      accessor: data => `${data.qty} ${formatUnit(data.material?.unit)}`
    },
    {
      Header: 'Дата расхода',
      accessor: data => formatDateWithTime(data.date)
    },
    {
      Header: 'Причина',
      accessor: data => formatWriteoffReason(data.reason)
    },
    {
      Header: 'ID детали',
      accessor: data => {
        if (data.type == EnWriteoffType.ThroughDetail) {
          return data.type_data.detailId
        }

        return ''
      }
    },
    {
      Header: 'Действие',
      accessor: data => (
        <DeleteWrireOff refetch={props.refetch} supplyId={data.id} />
      )
    }
  ]
}
