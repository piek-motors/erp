import { makeAutoObservable } from 'mobx'
import type { DetailClaimRequestFull } from './api'

export interface DetailRequestFormDetail {
  detail_id: number
  detail_name: string
  qty: number | null
  drawing_number?: string | null
}

export interface DetailRequestFormHydrateProps {
  initialOrderId?: number | string
  initialDetails?: DetailRequestFormDetail[]
  initialProductName?: string
  initialProductQty?: number
  request?: DetailClaimRequestFull
}

export class DetailRequestFormDetailStore {
  detail_id: number
  detail_name: string
  qty: number | null
  drawing_number?: string | null

  constructor(detail: DetailRequestFormDetail) {
    this.detail_id = detail.detail_id
    this.detail_name = detail.detail_name
    this.qty = detail.qty
    this.drawing_number = detail.drawing_number

    makeAutoObservable(this)
  }

  setQty(qty: number | null) {
    this.qty = qty
  }

  get hasPositiveQty() {
    return typeof this.qty === 'number' && this.qty > 0
  }

  get payload() {
    return {
      detail_id: this.detail_id,
      qty: this.qty ?? 0,
    }
  }
}

export class DetailRequestFormStore {
  orderId = ''
  productName = ''
  productQty: number | null = 1
  details: DetailRequestFormDetailStore[] = []

  constructor() {
    makeAutoObservable(this)
  }

  hydrate(props: DetailRequestFormHydrateProps) {
    const request = props.request?.request

    this.orderId = request?.order_id ?? String(props.initialOrderId ?? '')
    this.productName = request?.product_name ?? props.initialProductName ?? ''
    this.productQty = request?.product_qty ?? props.initialProductQty ?? 1
    this.details = (
      props.request
        ? props.request.details.map(detail => ({
            detail_id: detail.detail_id,
            detail_name: detail.detail_name,
            drawing_number: detail.drawing_number,
            qty: detail.qty,
          }))
        : (props.initialDetails ?? [])
    ).map(detail => new DetailRequestFormDetailStore(detail))
  }

  setOrderId(orderId: string) {
    this.orderId = orderId
  }

  setProductName(productName: string) {
    this.productName = productName
  }

  setProductQty(productQty: number | null) {
    this.productQty = productQty
  }

  removeDetail(detailId: number) {
    this.details = this.details.filter(detail => detail.detail_id !== detailId)
  }

  get hasDetails() {
    return this.details.length > 0
  }

  get canSave() {
    return (
      !!this.orderId.trim() &&
      !!this.productName.trim() &&
      this.productQty != null &&
      this.productQty > 0
    )
  }

  get payload() {
    if (this.productQty == null) return null

    return {
      order_id: this.orderId.trim(),
      product_name: this.productName.trim(),
      product_qty: this.productQty,
      details: this.details
        .filter(detail => detail.hasPositiveQty)
        .map(detail => detail.payload),
    }
  }
}
