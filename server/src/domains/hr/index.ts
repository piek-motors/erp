import { router } from '#root/sdk.js'
import { attendance } from './attendance/attendance_rpc.js'
import { employees } from './employees/employees_rpc.js'

export const hr = router({
  attendance,
  employees,
})
