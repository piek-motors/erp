import { Chip } from '@mui/joy'
import type { Column } from 'react-table'
import { Label, Link, P, Row, Stack } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { fmtDate } from '@/lib/utils/date_fmt'
import type { DetailClaimRequestDetailItem } from '@/server/domains/pdo/storage/detail_claim_request_repo'
import type { DetailClaimRequestListItem } from './api'

export const detailRequestColumns: Column<DetailClaimRequestListItem>[] = [
  {
    Header: '№',
    accessor: request => <Label xs>{request.id}</Label>,
  },
  {
    Header: 'ID заказа',
    accessor: request => <P level="body-sm">{request.order_id}</P>,
  },
  {
    Header: 'Изделие',
    accessor: request => (
      <Row gap={2}>
        <P lineHeight={1.15}>{request.product_name}</P>
        <P level="body-xs" color="primary">
          {request.product_qty} шт.
        </P>
      </Row>
    ),
  },
  {
    Header: 'Требуется дет.',
    accessor: request => <P level="body-sm">{request.detail_count}</P>,
  },
  {
    Header: 'Создано',
    accessor: request => (
      <P noWrap level="body-xs">
        {fmtDate(request.created_at)}
      </P>
    ),
  },
  {
    Header: 'Статус',
    accessor: request =>
      request.fulfilled_at ? (
        <Chip size="sm" color="success" variant="soft">
          Выполнено
        </Chip>
      ) : (
        <Chip size="sm" color="warning" variant="soft">
          Открыто
        </Chip>
      ),
  },
]

export const detailRequestDetailColumns: Column<DetailClaimRequestDetailItem>[] =
  [
    {
      Header: '№',
      accessor: detail => <Label xs>{detail.detail_id}</Label>,
    },
    {
      Header: 'Деталь',
      accessor: detail => (
        <Stack gap={0}>
          <Link to={openPage(routeMap.pdo.detail.edit, detail.detail_id)}>
            <P level="body-md" lineHeight={1.15}>
              {detail.detail_name}
            </P>
          </Link>
          {detail.drawing_number && (
            <P level="body-xs" color="neutral">
              {detail.drawing_number}
            </P>
          )}
        </Stack>
      ),
    },
    {
      Header: 'Нужно',
      accessor: detail => <P level="body-sm">{detail.qty}</P>,
    },
    {
      Header: 'На складе',
      accessor: detail => (
        <P level="body-sm">{detail.on_hand_balance || '—'}</P>
      ),
    },
    {
      Header: 'Адрес',
      accessor: detail => (
        <P
          level="body-sm"
          color={detail.stock_location ? undefined : 'neutral'}
        >
          {detail.stock_location || '—'}
        </P>
      ),
    },
  ]
