import {
  Layout,
  PrintOnly,
  WebOnly
} from 'components/utilities/conditional-display'
import { Textarea } from 'lib/index'
import { formatDate, formatMoney } from 'lib/utils/formatting'
import { makeAutoObservable } from 'mobx'
import { OrderStatus } from 'models'
import moment from 'moment'
import { RouterInput, RouterOutput } from 'srv/lib/trpc'
import { OrderUpdateInput } from 'srv/rpc/orders/router'
import { SuggestionsStore } from '../suggestions.store'

export enum InputTypes {
  Date = 'date',
  Text = 'text',
  Number = 'number',
  Money = 'money',
  Multiline = 'multiline',
  Manager = 'manager',
  Contractor = 'contractor',
  City = 'city'
}

export type ColumnDefinition = {
  label: string
  placeholder?: string
  inputType?: InputTypes
  value?: string | null
  onChange?: (value: string) => void
  view?: string
  layout?: Layout
  render?: () => React.ReactNode
  hidden?: boolean
}

type Order = RouterOutput['orders']['get']

export class StatementStore {
  suggestions = new SuggestionsStore()

  order?: Order | null

  status: OrderStatus = OrderStatus.PreOrder
  invoiceNumber = ''
  shippingDate: string | null = null
  orderNumber = ''
  managerId = ''
  contractor = ''
  city = ''
  totalAmount = ''
  comment = ''

  constructor() {
    makeAutoObservable(this)
  }

  async init(orderId: number) {
    await this.suggestions.init()
  }

  setOrder(order: Order) {
    this.order = order
  }
  setStatus(status: OrderStatus) {
    this.status = status
  }
  // Setters for each field
  setInvoiceNumber(value: string) {
    this.invoiceNumber = value
  }
  setShippingDate(value: string) {
    this.shippingDate = value
  }
  setOrderNumber(value: string) {
    this.orderNumber = value
  }
  setManagerId(value: string) {
    this.managerId = value
  }
  setContractor(value?: string) {
    this.contractor = value || ''
  }
  setCity(value?: string) {
    this.city = value || ''
  }
  setTotalAmount(value: string) {
    this.totalAmount = value
  }
  setComment(value: string) {
    this.comment = value
  }
  clear() {
    this.invoiceNumber = ''
    this.shippingDate = ''
    this.orderNumber = ''
    this.managerId = ''
    this.contractor = ''
    this.city = ''
    this.totalAmount = ''
    this.comment = ''
    // Note: status is intentionally not cleared to preserve reclamation status
  }

  applyState(o: Order) {
    this.order = o
    if (o.invoice_number) {
      this.invoiceNumber = o.invoice_number?.toString() ?? ''
    }
    if (o.shipping_date) {
      this.shippingDate = moment(o.shipping_date).format('DD.MM.YY')
    }
    if (o.order_number) {
      this.orderNumber = o.order_number?.toString() ?? ''
    }
    if (o.manager) {
      this.managerId = o.manager?.id?.toString() ?? ''
    }
    this.contractor = o.contractor ?? ''
    this.city = o.city ?? ''
    this.totalAmount = o.total_amount?.toString() ?? ''
    this.comment = o.comment ?? ''
  }
  prepareForUpdate(orderId: number): RouterInput['orders']['update'] {
    const fields: Partial<OrderUpdateInput> = {}

    fields.invoice_number = this.invoiceNumber
    fields.order_number = this.orderNumber
    fields.manager_id = parseInt(this.managerId, 10)
    fields.contractor = this.contractor
    fields.city = this.city
    fields.total_amount = parseFloat(this.totalAmount)
    fields.comment = this.comment

    if (this.shippingDate?.trim() === '') {
      fields.shipping_date = null
    } else {
      fields.shipping_date = moment(this.shippingDate, 'DD.MM.YY')
        .utc(true)
        .valueOf()
    }
    return {
      id: orderId,
      ...fields
    }
  }

  getcolumns(): ColumnDefinition[] {
    return [
      {
        label: 'План. отгрузка',
        inputType: InputTypes.Date,
        placeholder: 'ДД.ММ.ГГ',
        value: this.shippingDate,
        onChange: (v: string) => {
          this.setShippingDate(v)
        }
      },
      {
        label: 'Контрагент',
        inputType: InputTypes.Contractor,
        value: this.contractor,
        onChange: (v: string) => {
          this.setContractor(v)
        },
        hidden: true
      },
      {
        label: 'Cчет',
        inputType: InputTypes.Number,
        value: this.invoiceNumber,
        onChange: (v: string) => {
          this.setInvoiceNumber(v)
        }
      },
      {
        label: 'Номер заказа',
        inputType: InputTypes.Text,
        value: this.orderNumber,
        onChange: (v: string) => {
          this.setOrderNumber(v)
        }
      },
      {
        label: 'Оплачено',
        layout: PrintOnly,
        render: () => {
          if (!this.totalAmount) return ''
          const totalPaid = this.order?.total_paid ?? 0
          return `${((totalPaid / Number(this.totalAmount)) * 100).toFixed(0)}%`
        }
      },
      {
        label: 'Оплачено',
        layout: WebOnly,
        render: () => {
          if (!this.totalAmount) return ''
          if (!this.order?.total_paid) return ''
          const totalPaid = this.order?.total_paid

          return `${formatMoney(totalPaid)} (${(
            (totalPaid / Number(this.totalAmount)) *
            100
          ).toFixed(0)}%)`
        }
      },
      {
        label: 'Сумма заказа',
        layout: WebOnly,
        inputType: InputTypes.Money,
        value: this.totalAmount,
        onChange: (v: string) => {
          this.setTotalAmount(v)
        },
        view: formatMoney(this.order?.total_amount ?? 0)
      },
      {
        label: 'Менеджер',
        inputType: InputTypes.Manager,
        value: this.managerId,
        view: this.suggestions.managers.find(m => {
          const managerId = Number(this.managerId)
          if (Number.isNaN(managerId)) {
            return false
          }
          return managerId === m.id
        })?.fullName,
        onChange: (v: string) => {
          this.setManagerId(v)
        },
        layout: WebOnly
      },
      {
        label: 'Город',
        inputType: InputTypes.City,
        value: this.city,
        onChange: (v: string) => {
          this.setCity(v)
        },
        hidden: true
      },
      {
        label: 'В очередности с',
        view: formatDate(this.order?.acceptance_date)
      },
      {
        label: 'Отгружен',
        view: formatDate(this.order?.actual_shipping_date)
      },
      {
        label: 'Комментарий',
        inputType: InputTypes.Multiline,
        value: this.comment,
        onChange: (v: string) => {
          this.setComment(v)
        },
        render: () => {
          return (
            <Textarea
              readOnly
              color="neutral"
              size="sm"
              value={this.comment ?? ''}
              sx={{
                '--Textarea-focusedThickness': 0,
                border: 'none',
                boxShadow: 'none',
                p: 0
              }}
            />
          )
        }
      }
    ]
  }
}
