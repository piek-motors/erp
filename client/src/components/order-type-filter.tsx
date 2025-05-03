import { FormControl, Option, Select } from '@mui/joy'
import { OrderStatus } from 'src/types/global'

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
        <Option value={OrderStatus.ordArchived}>Заказы</Option>
        <Option value={OrderStatus.reclArchived}>Рекламации</Option>
      </Select>
    </FormControl>
  )
}
