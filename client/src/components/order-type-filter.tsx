import { FormControl, Option, Select } from '@mui/joy'
import { OrderStatus } from 'models'

interface IOrderTypeFilterProps {
  value: OrderStatus | ''
  onChange: (e: any) => void
}

export const OrderTypeFilter = ({ value, onChange }: IOrderTypeFilterProps) => (
  <FormControl>
    <Select
      name="managerFilter"
      value={value as string}
      onChange={(e, v) => onChange(v)}
      placeholder="Тип заказа"
    >
      <Option value={OrderStatus.Archived}>Заказы</Option>
      <Option value={OrderStatus.ReclamationArchived}>Рекламации</Option>
    </Select>
  </FormControl>
)
