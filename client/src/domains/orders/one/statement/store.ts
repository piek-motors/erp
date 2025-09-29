import {
  Layout,
  PrintOnly,
  WebOnly
} from 'components/utilities/conditional-display'
import { apolloClient } from 'lib/api'
import * as gql from 'lib/types/graphql-shema'
import { formatDate } from 'lib/utils/formatting'
import { makeAutoObservable } from 'mobx'
import { Order, OrderStatus } from 'models'
import moment from 'moment'
import { map } from '../../order.mappers'
import { SuggestionsStore } from '../stores/suggestions.store'

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
}

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
    const res = await apolloClient.query<
      gql.GetOrderByPkQuery,
      gql.GetOrderByPkQueryVariables
    >({
      query: gql.GetOrderByPkDocument,
      variables: {
        id: orderId
      }
    })
    const o = map.order.fromDto(res.data.orders_orders[0])
    this.loadState(o)
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

  loadState(o: Order) {
    this.order = o
    this.invoiceNumber = o.invoiceNumber?.toString() ?? ''
    this.shippingDate = o.shippingDateString()
    this.orderNumber = o.factoryNumber?.toString() ?? ''
    this.managerId = o.manager?.id?.toString()
    this.contractor = o.contractor ?? ''
    this.city = o.city ?? ''
    this.totalAmount = o.totalAmount?.toString()
    this.comment = o.comment ?? ''
  }
  prepareForUpdate(orderId: number): gql.UpdateOrderInfoMutationVariables {
    const fields: gql.UpdateOrderInfoMutationVariables['fields'] = {}
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
      fields.shipping_date = moment(this.shippingDate, 'DD.MM.YY').format(
        'YYYY-MM-DD'
      )
    }
    return {
      id: orderId,
      fields
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
        }
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
        view: this.order?.paidPercentage()
      },
      {
        label: 'Оплачено',
        layout: WebOnly,
        view:
          this.order?.totalPaidString() &&
          `${this.order.totalPaidString()} (${this.order.paidPercentage()})`
      },
      {
        label: 'Сумма заказа',
        layout: WebOnly,
        inputType: InputTypes.Money,
        value: this.totalAmount,
        onChange: (v: string) => {
          this.setTotalAmount(v)
        },
        view: this.order?.totalAmountString()
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
        }
      },
      {
        label: 'Город',
        inputType: InputTypes.City,
        value: this.city,
        onChange: (v: string) => {
          this.setCity(v)
        }
      },
      {
        label: 'В очередности с',
        view: formatDate(this.order?.acceptanceDate)
      },
      {
        label: 'Отгружен',
        view: formatDate(this.order?.actualShippingDate)
      },
      {
        label: 'Комментарий',
        inputType: InputTypes.Multiline,
        value: this.comment,
        onChange: (v: string) => {
          this.setComment(v)
        }
      }
    ]
  }
}
