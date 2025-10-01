import { Box } from '@mui/joy'
import { Step } from 'domains/metalflow/detail/detail.state'
import { Column } from 'react-table'
import { DateCell, DefectCell, ExecutorCell } from './cells'

export const columns: Column<Step>[] = [
  {
    Header: 'Операция',
    columns: [
      {
        Header: '№',
        accessor: (_, index) => index + 1
      },
      {
        accessor: 'name',
        Header: 'Операция'
      }
    ]
  },
  {
    Header: 'Исполнитель',
    columns: [
      {
        Header: 'ФИ',
        accessor: step => <ExecutorCell step={step} />
      },
      {
        Header: 'Дата',
        accessor: step => <DateCell step={step} />
      },
      {
        Header: 'Подпись',
        accessor: step => <Box />
      }
    ]
  },
  {
    Header: 'Приемка ОТК',
    columns: [
      {
        Header: 'Брак',
        accessor: step => <DefectCell step={step} />
      },
      {
        Header: 'Штамп',
        accessor: step => <Box />
      },
      {
        Header: 'Примечание',
        accessor: step => <Box />
      }
    ]
  }
]
