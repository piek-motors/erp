import { FactoryPage } from 'components/factory_page'
import { WebOnly } from 'components/utilities/conditional-display'
import { observer, routeMap, useEffect } from 'lib'
import { RouteConfig } from 'lib/types/global'
import ReportConfigurator from './control'
import { AttendanceReportComponent } from './report'
import { store } from './store'

const Attendance = observer(() => {
  useEffect(() => {
    store.load()
  }, [])
  return (
    <FactoryPage title={'Рабочее время'}>
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
