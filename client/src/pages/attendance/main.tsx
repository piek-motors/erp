import { UilConstructor } from '@iconscout/react-unicons'
import { Sheet, Typography } from '@mui/joy'
import { useMemo, useState } from 'react'
import { AppRoutes } from 'src/lib/routes'
import { Employee, RouteConfig } from 'src/types/global'
import { useGetEmployeeListQuery } from 'src/types/graphql-shema'
import { genColumns } from './columns'
import ReportConfigurator from './control'
import Table from './table'
import { prepareEmployeeData, queryVariables } from './utils'

type FullYear = number
type Month = number

export type State = {
  employess: Employee[]
  timeRetention: number | null
  selectedMonth: SelectedMonth
  showFullInfo: boolean
}

export type SelectedMonth = [Month, FullYear]

function Attendance() {
  const [state, setState] = useState<State>({
    employess: [],
    timeRetention: null,
    selectedMonth: [new Date().getMonth(), new Date().getFullYear()],
    showFullInfo: false
  })

  const { gte, lte } = queryVariables(state.selectedMonth)

  const { loading } = useGetEmployeeListQuery({
    variables: { gte, lte },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setState({
        ...state,
        timeRetention: data.attendance_config[0].TimeDeduction,
        employess: data.attendance_users_aggregate.nodes.filter(
          user => user.intervals.length
        )
      })
    }
  })

  const columns = useMemo(() => genColumns(state), [state])
  const data = state.employess.map(each => prepareEmployeeData(each, state))

  return (
    <>
      <div className="pageLayout__header">
        <UilConstructor className="pageLayout__icon" />
        <div className="pageLayout__title"> Рабочее время </div>
      </div>

      <ReportConfigurator state={state} setState={setState} />

      <Sheet>
        {!loading ? (
          <Table columns={columns} data={data} />
        ) : (
          <Typography m="10px">загрузка..</Typography>
        )}
      </Sheet>
    </>
  )
}

export default [
  {
    element: <Attendance />,
    path: AppRoutes.attendance
  }
] as RouteConfig[]
