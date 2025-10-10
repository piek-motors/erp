import { FormControl, Option, Select } from '@mui/joy'
import { suggestionsStore } from 'domains/orders/one/suggestions.store'
import { observer } from 'lib/deps'
import { useEffect } from 'react'

interface IManagerFilterProps {
  value: any
  onChange: (userId: number) => void
}

export const ManagerFilter = observer(
  ({ value, onChange }: IManagerFilterProps) => {
    useEffect(() => {
      suggestionsStore.init()
    }, [])
    return (
      <FormControl>
        <Select
          value={value}
          onChange={(e, v) => onChange(parseInt(v))}
          placeholder="Менеджер"
        >
          <Option value={0}>Все</Option>
          {suggestionsStore?.managers.map(user => (
            <Option value={user.id} key={user.id}>
              {user.shortName}
            </Option>
          ))}
        </Select>
      </FormControl>
    )
  }
)
