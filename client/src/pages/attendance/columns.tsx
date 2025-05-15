import { Typography } from '@mui/joy'
import { sec2hours } from 'lib/date'
import { CellProps, Column } from 'react-table'
import { PreparedEmployeeDto } from 'types/global'
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
          <Typography fontWeight={700}>
            {sec2hours(props.row.original.monthlyWithRetentionResolved)}
          </Typography>
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
