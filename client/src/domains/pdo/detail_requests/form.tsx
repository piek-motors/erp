import { Button, Divider } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { NumberInput } from '@/components/inputs/number_input'
import { InModal } from '@/components/modal'
import {
  ActionButton,
  AutoWidthInputLabled,
  ButtonXxs,
  DeleteIcon,
  InputLabled,
  Label,
  P,
  Row,
  Stack,
} from '@/lib/index'
import { notifier } from '@/lib/store/notifier.store'
import { type DetailClaimRequestFull, detail_request_api } from './api'
import {
  type DetailRequestFormDetail,
  type DetailRequestFormDetailStore,
  DetailRequestFormStore,
} from './form.store'

export interface DetailRequestFormModalProps {
  open: boolean
  setOpen(open: boolean): void
  initialOrderId?: number | string
  initialDetails?: DetailRequestFormDetail[]
  initialProductName?: string
  initialProductQty?: number
  request?: DetailClaimRequestFull
  onSaved?(): Promise<void> | void
}

export const NewDetailRequestButton = (props: {
  disabled?: boolean
  onClick(): void
}) => (
  <ButtonXxs
    size="sm"
    variant="soft"
    sx={{ fontSize: '.8rem' }}
    disabled={props.disabled}
    onClick={props.onClick}
  >
    Новое требование
  </ButtonXxs>
)

export const DetailRequestFormModal = observer(
  (props: DetailRequestFormModalProps) => {
    const [store] = useState(() => new DetailRequestFormStore())
    const request = props.request?.request

    useEffect(() => {
      if (!props.open) return

      store.hydrate(props)
    }, [
      props.open,
      props.initialOrderId,
      props.initialDetails,
      props.initialProductName,
      props.initialProductQty,
      props.request,
      store,
    ])

    const save = async () => {
      const payload = store.payload
      if (!store.canSave || !payload) return

      if (request) {
        await detail_request_api.update({ ...payload, id: request.id })
        notifier.ok('Требование обновлено')
      } else {
        await detail_request_api.create(payload)
        notifier.ok('Требование создано')
      }

      props.setOpen(false)
      await props.onSaved?.()
    }

    return (
      <InModal
        open={props.open}
        setOpen={props.setOpen}
        layout="fullscreen"
        slotProps={{
          dialog: {
            variant: 'soft',
            color: 'neutral',
          },
        }}
      >
        <Stack gap={1.5}>
          <P level="title-lg" fontWeight={600}>
            {request ? `Требование №${request.id}` : 'Новое требование'}
          </P>
          <DetailRequestProductFields store={store} />
          <Divider />
          <DetailRequestDetails store={store} />
          <DetailRequestFormActions
            store={store}
            onCancel={() => props.setOpen(false)}
            onSave={save}
          />
        </Stack>
      </InModal>
    )
  },
)

const DetailRequestProductFields = observer(
  ({ store }: { store: DetailRequestFormStore }) => (
    <Row alignItems="end">
      <InputLabled
        label="ID заказа"
        value={store.orderId}
        onChange={value => store.setOrderId(value)}
        sx={{ width: 80 }}
      />
      <AutoWidthInputLabled
        label="Название изделия"
        value={store.productName}
        onChange={value => store.setProductName(value)}
        minWidth={260}
        maxWidth="100%"
      />
      <NumberInput
        label="Кол-во изделий"
        value={store.productQty}
        onChange={value => store.setProductQty(value)}
        width={50}
      />
    </Row>
  ),
)

const DetailRequestDetails = observer(
  ({ store }: { store: DetailRequestFormStore }) => (
    <Stack gap={0.5}>
      <Label>Детали</Label>
      {!store.hasDetails && (
        <P level="body-sm" color="neutral">
          Нет деталей для требования
        </P>
      )}
      {store.details.map(detail => (
        <DetailRequestDetailRow
          key={detail.detail_id}
          detail={detail}
          onRemove={() => store.removeDetail(detail.detail_id)}
        />
      ))}
    </Stack>
  ),
)

const DetailRequestDetailRow = observer(
  ({
    detail,
    onRemove,
  }: {
    detail: DetailRequestFormDetailStore
    onRemove(): void
  }) => (
    <Row
      sx={{
        display: 'grid',
        gridTemplateColumns: '70px minmax(180px, 1fr) 100px 28px',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Label xs>№{detail.detail_id}</Label>
      <Stack gap={0}>
        <P lineHeight={1.15}>{detail.detail_name}</P>
        {detail.drawing_number && (
          <P level="body-xs" color="neutral">
            {detail.drawing_number}
          </P>
        )}
      </Stack>
      <NumberInput
        size="sm"
        variant="outlined"
        color="primary"
        value={detail.qty}
        onChange={qty => detail.setQty(qty)}
        width={40}
      />
      <DeleteIcon onClick={onRemove} />
    </Row>
  ),
)

const DetailRequestFormActions = observer(
  ({
    store,
    onCancel,
    onSave,
  }: {
    store: DetailRequestFormStore
    onCancel(): void
    onSave(): Promise<void>
  }) => (
    <Row justifyContent="flex-end">
      <Button variant="plain" color="neutral" onClick={onCancel}>
        Отмена
      </Button>
      <ActionButton
        label="Сохранить"
        disabled={!store.canSave}
        onClick={onSave}
      />
    </Row>
  ),
)
