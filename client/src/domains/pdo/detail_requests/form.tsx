import { Button, Divider } from '@mui/joy'
import { useEffect, useState } from 'react'
import { NumberInput } from '@/components/inputs/number_input'
import { InModal } from '@/components/modal'
import {
  ActionButton,
  DeleteIcon,
  InputLabled,
  Label,
  P,
  Row,
  Stack,
} from '@/lib/index'
import { notifier } from '@/lib/store/notifier.store'
import { type DetailClaimRequestFull, detail_request_api } from './api'

export interface DetailRequestFormDetail {
  detail_id: number
  detail_name: string
  qty: number
  drawing_number?: string | null
}

interface DetailRequestFormModalProps {
  open: boolean
  setOpen(open: boolean): void
  initialDetails?: DetailRequestFormDetail[]
  initialProductName?: string
  initialProductQty?: number
  request?: DetailClaimRequestFull
  onSaved?(): Promise<void> | void
}

export function DetailRequestFormModal(props: DetailRequestFormModalProps) {
  const request = props.request?.request
  const [orderId, setOrderId] = useState('')
  const [productName, setProductName] = useState('')
  const [productQty, setProductQty] = useState<number | null>(1)
  const [details, setDetails] = useState<DetailRequestFormDetail[]>([])

  useEffect(() => {
    if (!props.open) return

    setOrderId(request?.order_id ?? '')
    setProductName(request?.product_name ?? props.initialProductName ?? '')
    setProductQty(request?.product_qty ?? props.initialProductQty ?? 1)
    setDetails(
      props.request
        ? props.request.details.map(detail => ({
            detail_id: detail.detail_id,
            detail_name: detail.detail_name,
            drawing_number: detail.drawing_number,
            qty: detail.qty,
          }))
        : (props.initialDetails ?? []),
    )
  }, [
    props.open,
    props.initialDetails,
    props.initialProductName,
    props.initialProductQty,
    props.request,
    request,
  ])

  const updateQty = (detailId: number, qty: number | null) => {
    setDetails(current =>
      current.map(detail =>
        detail.detail_id === detailId ? { ...detail, qty: qty ?? 0 } : detail,
      ),
    )
  }

  const removeDetail = (detailId: number) => {
    setDetails(current =>
      current.filter(detail => detail.detail_id !== detailId),
    )
  }

  const canSave =
    orderId.trim() &&
    productName.trim() &&
    productQty != null &&
    productQty > 0 &&
    details.some(detail => detail.qty > 0)

  const save = async () => {
    if (!canSave || productQty == null) return

    const payload = {
      order_id: orderId.trim(),
      product_name: productName.trim(),
      product_qty: productQty,
      details: details
        .filter(detail => detail.qty > 0)
        .map(detail => ({
          detail_id: detail.detail_id,
          qty: detail.qty,
        })),
    }

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
    <InModal open={props.open} setOpen={props.setOpen} width="720px">
      <Stack gap={1.5}>
        <P level="title-lg" fontWeight={600}>
          {request ? `Требование №${request.id}` : 'Новое требование'}
        </P>
        <Row alignItems="end">
          <InputLabled
            label="Заказ"
            value={orderId}
            onChange={setOrderId}
            minWidth={140}
          />
          <InputLabled
            label="Изделие"
            value={productName}
            onChange={setProductName}
            minWidth={260}
          />
          <NumberInput
            label="Кол-во"
            value={productQty}
            onChange={setProductQty}
            width={90}
          />
        </Row>
        <Divider />
        <Stack gap={0.5}>
          <Label>Детали</Label>
          {details.length === 0 && (
            <P level="body-sm" color="neutral">
              Нет деталей для требования
            </P>
          )}
          {details.map(detail => (
            <Row
              key={detail.detail_id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '70px minmax(180px, 1fr) 100px 28px',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Label xs>№{detail.detail_id}</Label>
              <Stack gap={0}>
                <P level="body-sm" lineHeight={1.15}>
                  {detail.detail_name}
                </P>
                {detail.drawing_number && (
                  <P level="body-xs" color="neutral">
                    {detail.drawing_number}
                  </P>
                )}
              </Stack>
              <NumberInput
                value={detail.qty}
                onChange={qty => updateQty(detail.detail_id, qty)}
                width={82}
              />
              <DeleteIcon onClick={() => removeDetail(detail.detail_id)} />
            </Row>
          ))}
        </Stack>
        <Row justifyContent="flex-end">
          <Button
            variant="plain"
            color="neutral"
            onClick={() => props.setOpen(false)}
          >
            Отмена
          </Button>
          <ActionButton label="Сохранить" disabled={!canSave} onClick={save} />
        </Row>
      </Stack>
    </InModal>
  )
}
