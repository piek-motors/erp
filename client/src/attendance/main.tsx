import { Employee, RouteConfig } from 'lib/types/global'
import { useGetEmployeeListQuery } from 'lib/types/graphql-shema'
import { PageTitle } from '../components'
import { Box, LoadingHint, routeMap, Sheet, useMemo, useState } from '../lib'
import { genColumns } from './columns'
import ReportConfigurator from './control'
import { Table } from './table'
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

  // exlcude columns if no one of the uses is working in that day
  const dayIntervalCountsMap = new Map<number, number>()
  for (const each of state.employess) {
    for (const interval of each.intervals) {
      if (!interval.ent) continue

      const day = new Date(interval.ent).getDate()
      const count = dayIntervalCountsMap.get(day) ?? 0
      dayIntervalCountsMap.set(day, count + 1)
    }
  }

  return (
    <Box p={1} mb={5}>
      <PageTitle title={'Рабочее время'} />
      <Box p={2} width={'min-content'} borderRadius={20}>
        <ReportConfigurator state={state} setState={setState} />
      </Box>
      <Sheet>
        <LoadingHint show={loading} />
        <Table
          columns={columns.filter(each => {
            const day = Number(each.Header)
            if (Number.isNaN(day)) return true

            if (!Number.isNaN(day)) {
              if (dayIntervalCountsMap.get(day)) {
                return true
              }
            }
            return false
          })}
          data={data}
        />
      </Sheet>
    </Box>
  )
}

export default [
  {
    element: <Attendance />,
    path: routeMap.attendance
  }
] as RouteConfig[]
