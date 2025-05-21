/** @jsxImportSource @emotion/react */
import moment from 'moment'
import { Select } from 'pages/metal-flow/shared/select'
import React, { useEffect } from 'react'
import { InputStack, MultilineInput, MyInput, SendMutation } from 'shortcuts'
import { TOrder, TUser } from 'types/global'
import { useUpdateOrderInfoMutation } from 'types/graphql-shema'

enum FieldNames {
  InvoiceNumber = 'InvoiceNumber',
  ShippingDate = 'ShippingDate',
  OrderNumber = 'OrderNumber',
  ManagerID = 'ManagerID',
  Entity = 'Entity',
  City = 'City',
  TotalAmount = 'TotalAmount',
  PaidAmount = 'PaidAmount',
  Comment = 'Comment'
}

type FieldsValuesMap = {
  [key in FieldNames]: any
}

interface IEditableInfoProps {
  data: TOrder
  refetch(): void
  users: TUser[]
}

let fields: Partial<FieldsValuesMap> = {}

export function StatementInput({ data, refetch, users }: IEditableInfoProps) {
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
          OrderID: data.OrderID,
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
          default={moment(data.ShippingDate).format('DD.MM.YY') || ''}
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
          default={data.InvoiceNumber || ''}
          onChange={addField}
        />

        <MyInput
          label="Номер заказа"
          name={FieldNames.OrderNumber}
          default={data.OrderNumber}
          onChange={addField}
        />

        <Select
          label="Менеджер"
          selectElements={users.map(each => ({
            name: `${each.FirstName} ${each.LastName}`,
            value: each.UserID
          }))}
          defaultValue={data.User?.UserID}
          onChange={newValue => {
            if (!newValue) return
            fields.ManagerID = newValue || null
          }}
          disabled={data.User?.UserID === null}
        />

        <MyInput
          label="Контрагент"
          name={FieldNames.Entity}
          default={data.Entity}
          onChange={addField}
        />

        <MyInput
          label="Город"
          name={FieldNames.City}
          default={data.City}
          onChange={addField}
        />

        <MyInput
          type="number"
          label="Сумма заказа"
          name={FieldNames.TotalAmount}
          default={data.TotalAmount}
          onChange={addField}
        />

        <MultilineInput
          label="Комментарий"
          name={FieldNames.Comment}
          defaultValue={data.Comment || ''}
          onChange={addField}
        />
      </InputStack>
      <SendMutation
        onClick={() =>
          updateOrderInfo({
            variables: {
              OrderID: data.OrderID,
              fields
            }
          })
        }
      />
    </form>
  )
}
