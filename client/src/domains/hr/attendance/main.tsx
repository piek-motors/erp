import { FactoryPage } from '@/components/factory_page'
import { WebOnly } from '@/components/utilities/conditional-display'
import { Label, Link, observer, routeMap, useEffect } from '@/lib'
import type { RouteConfig } from '@/lib/types/global'
import { EmployeesPage } from '../employees/main'
import ReportConfigurator from './configurator'
import { AttendanceReportComponent } from './report'
import { store } from './store'

const Attendance = observer(() => {
  useEffect(() => {
    store.load()
  }, [])
  return (
    <FactoryPage
      title={'Рабочее время'}
      header={
        <Label>
          <Link to="/hr/employees">Сотрудники</Link>
        </Label>
      }
    >
      <WebOnly>
        <ReportConfigurator />
      </WebOnly>
      {store.report && <AttendanceReportComponent report={store.report} />}
    </FactoryPage>
  )
})

export default [
  {
    element: <Attendance />,
    path: routeMap.hr.attendance,
  },
  {
    element: <EmployeesPage />,
    path: routeMap.hr.employees,
  },
] as RouteConfig[]
