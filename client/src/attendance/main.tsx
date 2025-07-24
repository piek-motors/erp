import { WebOnly } from 'components/conditional-display'
import { Stack } from 'lib'
import { RouteConfig } from 'lib/types/global'
import { NavigationBar } from '../components'
import { Box, observer, routeMap } from '../lib'
import ReportConfigurator from './control'
import { AttendanceReportComponent } from './report'
import { store } from './store'

const Attendance = observer(() => {
  return (
    <Stack p={1} gap={1} sx={{ overflow: 'auto' }}>
      <NavigationBar t={'Рабочее время'} />
      <WebOnly>
        <Box width={'min-content'} borderRadius={20}>
          <ReportConfigurator />
        </Box>
      </WebOnly>
      {store.report && <AttendanceReportComponent report={store.report} />}
    </Stack>
  )
})

export default [
  {
    element: <Attendance />,
    path: routeMap.attendance
  }
] as RouteConfig[]
