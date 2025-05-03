import { FormControl, Option, Select } from '@mui/joy'
import { useGetManagersQuery } from 'src/types/graphql-shema'

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
          data?.erp_Users.map(user => (
            <Option value={user.UserID} key={user.UserID}>
              {`${user.FirstName} ${user.LastName}`}
            </Option>
          ))}
      </Select>
    </FormControl>
  )
}
