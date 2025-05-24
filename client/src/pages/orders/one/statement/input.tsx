/** @jsxImportSource @emotion/react */
import { Order } from 'domain-model'
import moment from 'moment'
import { Select } from 'pages/metal-flow/shared/select'
import React, { useEffect } from 'react'
import { InputStack, MultilineInput, MyInput, SendMutation } from 'shortcuts'
import { TUser } from 'types/global'
import { useUpdateOrderInfoMutation } from 'types/graphql-shema'

enum FieldNames {
  InvoiceNumber = 'invoice_number',
  ShippingDate = 'shipping_date',
  OrderNumber = 'order_number',
  ManagerID = 'manager_id',
  Entity = 'contractor',
  City = 'city',
  TotalAmount = 'total_amount',
  Comment = 'comment'
}

type FieldsValuesMap = {
  [key in FieldNames]: any
}

interface IEditableInfoProps {
  order: Order
  refetch(): void
  users: TUser[]
}

let fields: Partial<FieldsValuesMap> = {}

export function StatementInput({ order, refetch, users }: IEditableInfoProps) {
  const addField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => (fields[e.target.name as FieldNames] = e.target.value)

  function setField(name: FieldNames, value: string) {
    fields[name] = value
  }

  const [updateOrderInfo] = useUpdateOrderInfoMutation()

  async function saveChanges() {
    if (!Object.keys(fields).length) return
    try {
      await updateOrderInfo({
        variables: {
          id: order.id,
          fields
        }
      })

      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fields = {}
    return () => {
      saveChanges()
    }
  }, [])

  return (
    <form>
      <InputStack>
        <MyInput
          label="План. отгрузка"
          placeholder="ДД.ММ.ГГ"
          name={FieldNames.ShippingDate}
          default={order.shippingDateString()}
          onChange={e => {
            setField(
              FieldNames.ShippingDate,
              moment(e.target.value, 'DD.MM.YY').format('YYYY-MM-DD')
            )
          }}
        />

        <MyInput
          label="Номер счета"
          type="number"
          name={FieldNames.InvoiceNumber}
          default={order.invoiceNumber}
          onChange={addField}
        />

        <MyInput
          label="Номер заказа"
          name={FieldNames.OrderNumber}
          default={order.factoryNumber}
          onChange={addField}
        />

        <Select
          label="Менеджер"
          selectElements={users.map(each => ({
            name: `${each.first_name} ${each.last_name}`,
            value: each.id
          }))}
          defaultValue={order.manager?.id}
          onChange={newValue => {
            if (!newValue) return
            fields.manager_id = newValue || null
          }}
          disabled={order.manager?.id === null}
        />

        <MyInput
          label="Контрагент"
          name={FieldNames.Entity}
          default={order.contractor}
          onChange={addField}
        />

        <MyInput
          label="Город"
          name={FieldNames.City}
          default={order.city}
          onChange={addField}
        />

        <MyInput
          type="number"
          label="Сумма заказа"
          name={FieldNames.TotalAmount}
          default={order.totalAmount.toString()}
          onChange={addField}
        />

        <MultilineInput
          label="Комментарий"
          name={FieldNames.Comment}
          defaultValue={order.comment || ''}
          onChange={addField}
        />
      </InputStack>
      <SendMutation
        onClick={() =>
          updateOrderInfo({
            variables: {
              id: order.id,
              fields
            }
          })
        }
      />
    </form>
  )
}
