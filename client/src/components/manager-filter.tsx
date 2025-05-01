import { FormControl, InputLabel } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useGetManagersQuery } from 'src/types/graphql-shema'

interface IManagerFilterProps {
  value: any
  onChange: (e: SelectChangeEvent<any>) => void
}

export function ManagerFilter({ value, onChange }: IManagerFilterProps) {
  const { data, loading } = useGetManagersQuery()

  return (
    <FormControl>
      <InputLabel>Менеджер</InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem value={0}>Все</MenuItem>

        {!loading &&
          data?.erp_Users.map(user => (
            <MenuItem value={user.UserID} key={user.UserID}>
              {`${user.FirstName} ${user.LastName}`}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}
