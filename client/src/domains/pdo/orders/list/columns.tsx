import { OrderPriority, ProductionOrderStatus as Status, time } from 'models'
import type { Column } from 'react-table'
import { DetailName } from '@/domains/pdo/detail/detail_name'
import { Label, P, Row } from '@/lib/index'
import { fmtDate, time_delta_days } from '@/lib/utils/date_fmt'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { Indicator } from '../../shared/basic'

const commonColumns: Column<ListOrdersOutput>[] = [
  {
    Header: '№',
    accessor: m => <Label level="body-xs">{m.id}</Label>,
  },
  {
    Header: 'Деталь',
    accessor: d => (
      <Row flexWrap={'nowrap'}>
        {d.duplicated && (
          <Indicator
            title={`Дублирует заказ №${d.duplicated}`}
            color={'rgb(255, 111, 7)'}
          />
        )}
        <DetailName
          detail={{
            id: d.detail_id,
            name: d.detail_name,
            group_id: d.group_id,
          }}
          with_group_name
        />
        {d.priority == OrderPriority.High && (
          <Indicator title={`Высокий приоритет`} color={'red'} />
        )}
      </Row>
    ),
  },
  {
    Header: 'Кол.',
    accessor: ({ qty }) => (qty ? <P>{qty}</P> : ''),
  },
]

const preparationColumns = commonColumns.concat([
  {
    Header: 'Создан',
    accessor: m => (
      <P noWrap level="body-xs">
        {m.created_at}
      </P>
    ),
  },
])

const productionColumns = commonColumns.concat([
  {
    Header: 'Запуск',
    accessor: m => {
      if (!m.started_at) return null
      const timedelta = time_delta_days(m.started_at)
      return (
        <Row flexWrap={'nowrap'}>
          <P level="body-xs" noWrap>
            {time.fmt_relative_or_calendar_date(m.started_at)}
          </P>
          <Label color="neutral" xs fontWeight={400} noWrap>
            {timedelta}
          </Label>
        </Row>
      )
    },
  },
  {
    Header: 'Операция',
    accessor: m => <P level="body-xs">{m.current_operation}</P>,
  },
  {
    Header: '_',
    accessor: m => {
      const timedelta = time_delta_days(Number(m.current_operation_start_at))
      return (
        <>
          {timedelta && (
            <P level="body-xs" noWrap>
              {timedelta}
            </P>
          )}
        </>
      )
    },
  },
])

const finishColumns = commonColumns.concat([
  {
    Header: 'Выход',
    accessor: ({ output_qty }) => (output_qty ? <P>{output_qty}</P> : ''),
  },
  {
    Header: 'Запуск',
    accessor: m => (
      <P noWrap level="body-xs">
        {fmtDate(m.started_at, true)}
      </P>
    ),
  },
  {
    Header: 'Финиш',
    accessor: m =>
      m.finished_at && (
        <P noWrap level="body-xs">
          {time.fmt_relative_or_calendar_date(m.finished_at)}
        </P>
      ),
  },
  {
    Header: 'Дельта',
    accessor: m => {
      if (!m.time_delta) return ''
      const totalDays = Math.round(m.time_delta / (3600 * 24))
      return (
        <P noWrap level="body-xs">
          {totalDays} д.
        </P>
      )
    },
  },
])

export function getColumns(status: Status) {
  switch (status) {
    case Status.Waiting:
    case Status.Preparation:
      return preparationColumns
    case Status.Production:
      return productionColumns
    case Status.Archived:
      return finishColumns
    default:
      return commonColumns
  }
}
