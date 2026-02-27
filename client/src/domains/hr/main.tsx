import { FactoryPage } from '@/components/factory_page'
import { WebOnly } from '@/components/utilities/conditional-display'
import { Button, Link, observer, routeMap } from '@/lib'
import type { RouteConfig } from '@/lib/types/global'
import { ReportConfigurator } from './attendance/configurator'
import { AttendanceReportView } from './attendance/report/report'
import { EmployeesPage } from './employees/main'

const HrHome = observer(() => (
  <>
    <WebOnly>
      <FactoryPage title={'Рабочее время'}>
        <ReportConfigurator />
        <Button variant="plain">
          <Link to="/hr/employees">Сотрудники</Link>
        </Button>
      </FactoryPage>
    </WebOnly>
  </>
))

export default [
  {
    element: <HrHome />,
    path: routeMap.hr.attendance,
  },
  {
    element: <EmployeesPage />,
    path: routeMap.hr.employees,
  },
  {
    element: <AttendanceReportView />,
    path: '/hr/attendance/report',
  },
] as RouteConfig[]
