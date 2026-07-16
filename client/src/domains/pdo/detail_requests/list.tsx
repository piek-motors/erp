import { Button, Chip, Divider } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import type { Column } from 'react-table'
import { BackIconButton } from '@/components/buttons'
import { DeleteConfirmDialog } from '@/components/delete_confirm_dialog'
import { ScrollableWindow } from '@/components/inputs'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import {
  ActionButton,
  Label,
  Link,
  Loading,
  P,
  Row,
  Stack,
  useNavigate,
  useParams,
} from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { fmtDate } from '@/lib/utils/date_fmt'
import type { DetailClaimRequestDetailItem } from '@/server/domains/pdo/storage/detail_claim_request_repo'
import { type DetailClaimRequestListItem, detail_request_api } from './api'
import { DetailRequestFormModal } from './form'
import { DetailRequestListStore } from './list.store'

const columns: Column<DetailClaimRequestListItem>[] = [
  {
    Header: '№',
    accessor: request => <Label xs>{request.id}</Label>,
  },
  {
    Header: 'Заказ',
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

const detailColumns: Column<DetailClaimRequestDetailItem>[] = [
  {
    Header: '№',
    accessor: detail => <Label xs>{detail.detail_id}</Label>,
  },
  {
    Header: 'Деталь',
    accessor: detail => (
      <Stack gap={0}>
        <Link to={openPage(routeMap.pdo.detail.edit, detail.detail_id)}>
          <P level="body-sm" lineHeight={1.15}>
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
    Header: 'Остаток',
    accessor: detail => <P level="body-sm">{detail.on_hand_balance || '—'}</P>,
  },
  {
    Header: 'Адрес',
    accessor: detail => (
      <P level="body-sm" color={detail.stock_location ? undefined : 'neutral'}>
        {detail.stock_location || '—'}
      </P>
    ),
  },
]

export const DetailRequestListPage = observer(() => {
  const [store] = useState(() => new DetailRequestListStore())
  const navigate = useNavigate()

  useEffect(() => {
    store.reload()
  }, [])

  return (
    <ScrollableWindow
      static={
        <MobilePadding desktop_too>
          <Stack gap={0.5}>
            <MobileNavModal t="Требования" />
            <Row>
              <P level="title-md" fontWeight={600}>
                Требования деталей
              </P>
              <Label color="neutral">последние 30 дней</Label>
            </Row>
          </Stack>
        </MobilePadding>
      }
      scroll={
        <Stack sx={{ p: 1 }}>
          {detail_request_api.loader.loading && <Loading />}
          {store.requests.length === 0 &&
            !detail_request_api.loader.loading && (
              <P level="body-sm" color="neutral">
                Требований нет
              </P>
            )}
          <Table
            columns={columns}
            data={store.requests}
            onRowClick={request =>
              navigate(openPage(routeMap.pdo.detailRequest, request.id))
            }
          />
        </Stack>
      }
    />
  )
})

export const DetailRequestDetailsPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    throw new Error('Invalid page params; id is required')
  }

  const [store] = useState(() => new DetailRequestListStore())
  const requestId = Number(id)
  if (!Number.isFinite(requestId)) {
    throw new Error('Invalid page params; id must be a number')
  }

  useEffect(() => {
    store.setSelectedId(requestId)
  }, [id])

  return <DetailRequestDetails store={store} />
})

const DetailRequestDetails = observer(
  ({ store }: { store: DetailRequestListStore }) => {
    const navigate = useNavigate()

    useEffect(() => {
      if (store.selectedId) {
        store.loadSelected()
      }
    }, [store.selectedId])

    const request = store.selectedRequest

    return (
      <>
        {!request ? (
          <Loading />
        ) : (
          <Stack gap={1.5} p={0}>
            <Row justifyContent="space-between">
              <Row>
                <BackIconButton link={routeMap.pdo.detailRequests} />
                <Stack gap={0}>
                  <P level="title-lg" fontWeight={600}>
                    Требование №{request.request.id}
                  </P>
                  <P level="body-sm" color="neutral">
                    Создано {fmtDate(request.request.created_at)}
                  </P>
                </Stack>
              </Row>
              {request.request.fulfilled_at ? (
                <Chip size="sm" color="success" variant="soft">
                  Выполнено {fmtDate(request.request.fulfilled_at)}
                </Chip>
              ) : (
                <Chip size="sm" color="warning" variant="soft">
                  Открыто
                </Chip>
              )}
            </Row>
            <Row>
              <Label label="Заказ" />
              <P>{request.request.order_id}</P>
              <Divider orientation="vertical" />
              <Label label="Изделие" />
              <P>{request.request.product_name}</P>
              <Label color="neutral">{request.request.product_qty} шт.</Label>
            </Row>
            <Table
              small
              columns={detailColumns}
              data={request.details}
              sx={{ minWidth: 620 }}
            />
            <Row justifyContent="space-between">
              <span />
              <Row justifyContent="flex-end">
                <Button
                  variant="soft"
                  color="neutral"
                  onClick={() => store.setEditOpen(true)}
                >
                  Изменить
                </Button>
                {!request.request.fulfilled_at && (
                  <ActionButton
                    label="Выполнить"
                    props={{ color: 'success' }}
                    onClick={() => store.fulfillSelected()}
                  />
                )}
                <DeleteConfirmDialog
                  title={`Требование №${request.request.id}`}
                  button={
                    <Button variant="soft" color="danger">
                      Удалить
                    </Button>
                  }
                  handleDelete={async () => {
                    await store.deleteSelected()
                    navigate(routeMap.pdo.detailRequests)
                  }}
                />
              </Row>
            </Row>
          </Stack>
        )}
        {request && (
          <DetailRequestFormModal
            open={store.editOpen}
            setOpen={open => store.setEditOpen(open)}
            request={request}
            onSaved={() => store.afterEditSaved()}
          />
        )}
      </>
    )
  },
)
