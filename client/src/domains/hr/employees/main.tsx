import { Box, Container } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { NavTopBar } from '@/components/nav_topbar'
import { employeeStore } from './employee.store'
import { EmployeeList } from './employee_list'

export const EmployeesPage = observer(() => {
  useEffect(() => {
    employeeStore.load()
  }, [])

  return (
    <Box p={1}>
      <NavTopBar t="Сотрудники" />
      <Container sx={{ pb: 2 }} maxWidth="md">
        <EmployeeList store={employeeStore} />
      </Container>
    </Box>
  )
})
