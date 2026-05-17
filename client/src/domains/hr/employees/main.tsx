import { Box, Sheet } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { NavTopBar } from '@/components/nav_topbar'
import { employee_list_vm } from './employee.store'
import { EmployeeTable } from './employee_list'

export const EmployeesPage = observer(() => {
  useEffect(() => {
    employee_list_vm.load()
  }, [])

  return (
    <Box
      p={1}
      sx={{ borderRadius: 5, p: 1, overflowX: 'auto', minWidth: '800px' }}
    >
      <NavTopBar t="Сотрудники" />
      <Sheet sx={{ borderRadius: 5, p: 1 }}>
        <EmployeeTable store={employee_list_vm} />
      </Sheet>
    </Box>
  )
})
