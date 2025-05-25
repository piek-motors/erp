/** @jsxImportSource @emotion/react */
import { Order } from 'domain-model'
import moment from 'moment'
import { Select } from 'pages/metal-flow/shared/select'
import React, { useEffect } from 'react'
import { InputStack, MultilineInput, MyInput, SendMutation } from 'shortcuts'
import { TUser } from 'types/global'
import { useUpdateOrderInfoMutation } from 'types/graphql-shema'

enum GraphQLFieldNames {
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
  [key in GraphQLFieldNames]: any
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
  ) => (fields[e.target.name as GraphQLFieldNames] = e.target.value)

  function setField(name: GraphQLFieldNames, value: string) {
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
          name={GraphQLFieldNames.ShippingDate}
          default={order.shippingDateString()}
          onChange={e => {
            setField(
              GraphQLFieldNames.ShippingDate,
              moment(e.target.value, 'DD.MM.YY').format('YYYY-MM-DD')
            )
          }}
        />

        <MyInput
          label="Номер счета"
          type="number"
          name={GraphQLFieldNames.InvoiceNumber}
          default={order.invoiceNumber}
          onChange={addField}
        />

        <MyInput
          label="Номер заказа"
          name={GraphQLFieldNames.OrderNumber}
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
          name={GraphQLFieldNames.Entity}
          default={order.contractor}
          onChange={addField}
        />

        <MyInput
          label="Город"
          name={GraphQLFieldNames.City}
          default={order.city}
          onChange={addField}
        />

        <MyInput
          type="number"
          label="Сумма заказа"
          name={GraphQLFieldNames.TotalAmount}
          default={order.totalAmount.toString()}
          onChange={addField}
        />

        <MultilineInput
          label="Комментарий"
          name={GraphQLFieldNames.Comment}
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
