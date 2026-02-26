/** @jsxImportSource @emotion/react */
import { Sheet, Table } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { BaseAutocomplete } from '@/components/base-autocomplete'
import { Label, P } from '@/lib'
import {
  employeeStore,
  type JobTitleOption,
  type EmployeeStore,
} from './employee.store'

interface EmployeeListProps {
  store?: typeof employeeStore
}

/** Single Employee Row */
const EmployeeRow = observer(
  ({
    employee,
    index,
    store,
  }: {
    employee: EmployeeStore['employees'][0]
    index: number
    store: EmployeeStore
  }) => {
    const currentValue = store.getEditedJobTitle(employee.id, employee.jobTitle)
    const currentOption: JobTitleOption | null = currentValue
      ? { label: currentValue, value: currentValue }
      : null

    return (
      <tr key={employee.id}>
        <td>
          <Label xs>{index + 1}</Label>
        </td>
        <td>
          <P>{employee.name}</P>
        </td>
        <td>
          <BaseAutocomplete
            freeSolo
            size="sm"
            variant="plain"
            options={store.jobTitles}
            value={currentOption}
            sx={{ fontSize: '.8rem' }}
            onChange={newValue =>
              store.setEditedJobTitle(employee.id, newValue?.value ?? '')
            }
            onBlur={() => store.saveJobTitle(employee.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') store.saveJobTitle(employee.id)
              if (e.key === 'Escape') store.cancelEdit(employee.id)
            }}
            width={250}
            getOptionLabel={option =>
              typeof option === 'string' ? option : option.label
            }
            createOptionLabel={inputValue => `+ ${inputValue}`}
          />
        </td>
        <td>
          <Label xs>{employee.card}</Label>
        </td>
      </tr>
    )
  },
)

/** Employee Table */
const EmployeeTable = observer(({ store }: { store: EmployeeStore }) => (
  <Table stickyHeader hoverRow size="sm">
    <thead>
      <tr>
        <th style={{ width: 'min-content', paddingRight: 15 }}>#</th>
        <th>Имя</th>
        <th>Должность</th>
        <th>Номер белой карты</th>
      </tr>
    </thead>
    <tbody>
      {store.employees.length === 0 ? (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center' }}>
            <P level="body-sm" textColor="text.tertiary">
              'Список сотрудников пуст'
            </P>
          </td>
        </tr>
      ) : (
        store.employees.map((employee, index) => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            index={index}
            store={store}
          />
        ))
      )}
    </tbody>
  </Table>
))

/** Main Component */
export const EmployeeList = observer((props: EmployeeListProps) => {
  const store = props.store || employeeStore

  return (
    <Sheet sx={{ borderRadius: 5, p: 1 }}>
      <EmployeeTable store={store} />
    </Sheet>
  )
})
