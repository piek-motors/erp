import { router } from '#root/lib/trpc/trpc.js'
import { getAttendanceList } from './list.js'

export const attendanceRouter = router({
  getAttendanceList: getAttendanceList
})
