import { WebOnly } from 'components/conditional-display'
import { FactoryPage } from 'components/factory_page'
import { observer, routeMap } from 'lib'
import { RouteConfig } from 'lib/types/global'
import ReportConfigurator from './control'
import { AttendanceReportComponent } from './report'
import { store } from './store'

const Attendance = observer(() => {
  return (
    <FactoryPage pageTitle={'Рабочее время'}>
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
    path: routeMap.attendance
  }
] as RouteConfig[]
