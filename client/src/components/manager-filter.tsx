import { FormControl, Option, Select } from '@mui/joy'
import { useGetManagersQuery } from 'types/graphql-shema'

interface IManagerFilterProps {
  value: any
  onChange: (userId: number) => void
}

export function ManagerFilter({ value, onChange }: IManagerFilterProps) {
  const { data, loading } = useGetManagersQuery()

  return (
    <FormControl>
      <Select
        value={value}
        onChange={(e, v) => onChange(parseInt(v))}
        placeholder="Менеджер"
      >
        <Option value={0}>Все</Option>

        {!loading &&
          data?.users.map(user => (
            <Option value={user.id} key={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </Option>
          ))}
      </Select>
    </FormControl>
  )
}
