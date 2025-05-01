import { FormControl, InputLabel } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { OrderStatus } from 'src/types/global'

interface IOrderTypeFilterProps {
  value: OrderStatus | ''
  onChange: (e: SelectChangeEvent) => void
}

export function OrderTypeFilter({ value, onChange }: IOrderTypeFilterProps) {
  return (
    <FormControl>
      <InputLabel>Тип</InputLabel>
      <Select name="managerFilter" value={value as string} onChange={onChange}>
        <MenuItem value={OrderStatus.ordArchived}>Заказы</MenuItem>
        <MenuItem value={OrderStatus.reclArchived}>Рекламации</MenuItem>
      </Select>
    </FormControl>
  )
}
