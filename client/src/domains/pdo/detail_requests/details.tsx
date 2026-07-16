import { EditRounded } from '@mui/icons-material'
import { Chip, Divider } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { BackIconButton } from '@/components/buttons'
import { DeleteConfirmDialog } from '@/components/delete_confirm_dialog'
import { Table } from '@/components/table.impl'
import {
  ActionButton,
  DeleteIcon,
  IconButtonXxs,
  Label,
  Loading,
  P,
  Row,
  Stack,
  useNavigate,
} from '@/lib/index'
import { routeMap } from '@/lib/routes'
import { fmtDate } from '@/lib/utils/date_fmt'
import type { DetailClaimRequestFull } from './api'
import { detailRequestDetailColumns } from './columns'
import { DetailRequestFormModal } from './form'
import type { DetailRequestListStore } from './list.store'

export const DetailRequestDetails = observer(
  ({ store }: { store: DetailRequestListStore }) => {
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
            <DetailRequestHeader request={request} />
            <DetailRequestMeta store={store} />

            <Table
              small
              columns={detailRequestDetailColumns}
              data={request.details}
              sx={{ minWidth: 620 }}
            />
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

const DetailRequestHeader = ({
  request,
}: {
  request: DetailClaimRequestFull
}) => (
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
    <DetailRequestStatus request={request} />
  </Row>
)

const DetailRequestStatus = ({
  request,
}: {
  request: DetailClaimRequestFull
}) =>
  request.request.fulfilled_at ? (
    <Chip size="sm" color="success" variant="soft">
      Исполнено {fmtDate(request.request.fulfilled_at)}
    </Chip>
  ) : request.request.sent_to_warehouse_at ? (
    <Chip size="sm" color="primary" variant="soft">
      В сборке {fmtDate(request.request.sent_to_warehouse_at)}
    </Chip>
  ) : (
    <Chip size="sm" color="warning" variant="soft">
      Открыто
    </Chip>
  )

const DetailRequestMeta = observer(
  ({ store }: { store: DetailRequestListStore }) => {
    const request = store.selectedRequest
    if (!request) return
    return (
      <Row>
        <Label label="Заказ" />
        <P>{request.request.order_id}</P>
        <Divider orientation="vertical" />
        <Label label="Изделие" />
        <P fontWeight={600}>{request.request.product_name.trim()}</P>
        <Label fontWeight={600}> –– {request.request.product_qty} шт.</Label>

        <DetailRequestActions store={store} request={request} />
      </Row>
    )
  },
)

const DetailRequestActions = observer(
  ({
    store,
    request,
  }: {
    store: DetailRequestListStore
    request: DetailClaimRequestFull
  }) => {
    const navigate = useNavigate()
    if (request.request.fulfilled_at) return
    const isSentToWarehouse = !!request.request.sent_to_warehouse_at

    return (
      <Row justifyContent="space-between">
        <span />
        <Row justifyContent="flex-end">
          {!isSentToWarehouse && (
            <ActionButton
              label="Передать на склад"
              props={{ color: 'primary', variant: 'soft' }}
              onClick={() => store.sendSelectedToWarehouse()}
            />
          )}
          {isSentToWarehouse && (
            <ActionButton
              label="Исполнен"
              props={{ color: 'success', variant: 'soft' }}
              onClick={() => store.fulfillSelected()}
            />
          )}
          <IconButtonXxs
            title="Изменить"
            aria-label="Изменить"
            variant="soft"
            color="neutral"
            onClick={() => store.setEditOpen(true)}
            icon={EditRounded}
          />
          <DeleteConfirmDialog
            title={`Требование №${request.request.id}`}
            button={<DeleteIcon />}
            handleDelete={async () => {
              await store.deleteSelected()
              navigate(routeMap.pdo.detailRequests)
            }}
          />
        </Row>
      </Row>
    )
  },
)
