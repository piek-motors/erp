import { sec2hours } from 'lib/date'
import { P } from 'lib/shortcuts'
import { PreparedEmployeeDto } from 'lib/types/global'
import { CellProps, Column } from 'react-table'
import { State } from './main'
import { ArrayFromDaysInMonth } from './utils'

export const genColumns = (state: State) => {
  const columns: Column<PreparedEmployeeDto>[] = [
    {
      Header: 'Имя',
      accessor: 'firstname'
    },
    {
      Header: 'Фамиллия',
      accessor: 'lastname'
    },
    {
      Header: 'Итого',
      Cell: (props: CellProps<PreparedEmployeeDto>) => (
        <>
          <div>{sec2hours(props.row.original.monthlyWithRetention)}</div>
          <P fontWeight={700}>
            {sec2hours(props.row.original.monthlyWithRetentionResolved)}
          </P>
        </>
      )
    },
    ...ArrayFromDaysInMonth.create(state.selectedMonth).map<
      Column<PreparedEmployeeDto>
    >(day => {
      return {
        Header: day.toString(),
        Cell: (props: CellProps<PreparedEmployeeDto>) => {
          const data = props.row.original.intervals[day - 1]
          if (!data) return <></>

          return (
            <>
              {state.showFullInfo && (
                <>
                  <div>{data.ent}</div>
                  <div>{data.ext}</div>
                </>
              )}
              <div className={data.resolved ? 'resolved' : ''}>
                {data.durWithRetention_human}
              </div>
            </>
          )
        }
      }
    })
  ]

  return columns
}
