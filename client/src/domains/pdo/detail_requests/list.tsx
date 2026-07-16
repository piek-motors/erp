import { Button, Chip, Divider } from '@mui/joy'
import { useEffect, useState } from 'react'
import type { Column } from 'react-table'
import { DeleteConfirmDialog } from '@/components/delete_confirm_dialog'
import { ScrollableWindow } from '@/components/inputs'
import { InModal } from '@/components/modal'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import { ActionButton, Label, Link, Loading, P, Row, Stack } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { notifier } from '@/lib/store/notifier.store'
import { fmtDate } from '@/lib/utils/date_fmt'
import type { DetailClaimRequestDetailItem } from '@/server/domains/pdo/storage/detail_claim_request_repo'
import {
  type DetailClaimRequestFull,
  type DetailClaimRequestListItem,
  detail_request_api,
} from './api'
import { DetailRequestFormModal } from './form'

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
      <Stack gap={0}>
        <P level="body-sm" lineHeight={1.15}>
          {request.product_name}
        </P>
        <P level="body-xs" color="neutral">
          {request.product_qty} шт.
        </P>
      </Stack>
    ),
  },
  {
    Header: 'Детали',
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
    accessor: detail => <P level="body-sm">{detail.on_hand_balance}</P>,
  },
]

export function DetailRequestListPage() {
  const [requests, setRequests] = useState<DetailClaimRequestListItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const reload = async () => {
    setRequests(await detail_request_api.list())
  }

  useEffect(() => {
    reload()
  }, [])

  return (
    <>
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
            {requests.length === 0 && !detail_request_api.loader.loading && (
              <P level="body-sm" color="neutral">
                Требований за последние 30 дней нет
              </P>
            )}
            <Table
              columns={columns}
              data={requests}
              onRowClick={request => setSelectedId(request.id)}
            />
          </Stack>
        }
      />
      <DetailRequestDetailsModal
        id={selectedId}
        setId={setSelectedId}
        onChanged={reload}
      />
    </>
  )
}

function DetailRequestDetailsModal(props: {
  id: number | null
  setId(id: number | null): void
  onChanged(): Promise<void>
}) {
  const [request, setRequest] = useState<DetailClaimRequestFull | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const load = async () => {
    if (!props.id) return
    setRequest(await detail_request_api.get(props.id))
  }

  useEffect(() => {
    if (props.id) {
      load()
    } else {
      setRequest(null)
    }
  }, [props.id])

  const close = () => props.setId(null)

  return (
    <>
      <InModal open={props.id != null} setOpen={open => !open && close()}>
        {!request ? (
          <Loading />
        ) : (
          <Stack gap={1.5}>
            <Row justifyContent="space-between">
              <Stack gap={0}>
                <P level="title-lg" fontWeight={600}>
                  Требование №{request.request.id}
                </P>
                <P level="body-sm" color="neutral">
                  Создано {fmtDate(request.request.created_at)}
                </P>
              </Stack>
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
            <Row justifyContent="flex-end">
              <Button
                variant="soft"
                color="neutral"
                onClick={() => setEditOpen(true)}
              >
                Изменить
              </Button>
              {!request.request.fulfilled_at && (
                <ActionButton
                  label="Выполнить"
                  props={{ color: 'success' }}
                  onClick={async () => {
                    await detail_request_api.fulfill(request.request.id)
                    notifier.ok('Требование выполнено')
                    await load()
                    await props.onChanged()
                  }}
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
                  await detail_request_api.delete(request.request.id)
                  notifier.ok('Требование удалено')
                  close()
                  await props.onChanged()
                }}
              />
            </Row>
          </Stack>
        )}
      </InModal>
      {request && (
        <DetailRequestFormModal
          open={editOpen}
          setOpen={setEditOpen}
          request={request}
          onSaved={async () => {
            await load()
            await props.onChanged()
          }}
        />
      )}
    </>
  )
}
