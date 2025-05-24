import { FormControl, Option, Select } from '@mui/joy'
import { OrderStatus } from 'domain-model'

interface IOrderTypeFilterProps {
  value: OrderStatus | ''
  onChange: (e: any) => void
}

export function OrderTypeFilter({ value, onChange }: IOrderTypeFilterProps) {
  return (
    <FormControl>
      <Select
        name="managerFilter"
        value={value as string}
        onChange={onChange}
        placeholder="Тип заказа"
      >
        <Option value={OrderStatus.Archived}>Заказы</Option>
        <Option value={OrderStatus.ReclamationArchived}>Рекламации</Option>
      </Select>
    </FormControl>
  )
}
