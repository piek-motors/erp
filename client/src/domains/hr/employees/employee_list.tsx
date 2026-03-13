/** @jsxImportSource @emotion/react */
import { Input, Table } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { BaseAutocomplete } from '@/components/base-autocomplete'
import { DeleteIcon, Label } from '@/lib'
import { DeleteEmployeeDialog } from './dialogs/delete-employee-dialog'
import type { EmployeeListVM, JobTitleOption } from './employee.store'

export const EmployeeTable = observer(
  ({ store }: { store: EmployeeListVM }) => (
    <Table stickyHeader size="sm" sx={{}}>
      <thead>
        <tr>
          <th style={{ width: 'min-content', paddingRight: 15 }}>№</th>
          <th>Белая карта</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Должность</th>
          <th>Черная карта</th>
          <th>Дней с посл. события</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {store.employees.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center' }}>
              <Label level="body-sm" textColor="text.tertiary">
                Список сотрудников пуст
              </Label>
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
  ),
)

/** Single Employee Row */
const EmployeeRow = observer(
  ({
    employee,
    index,
    store,
  }: {
    employee: EmployeeListVM['employees'][0]
    index: number
    store: EmployeeListVM
  }) => {
    const currentJobTitle = store.getEditedJobTitle(
      employee.id,
      employee.jobTitle,
    )
    const currentJobTitleOption: JobTitleOption | null = currentJobTitle
      ? { label: currentJobTitle, value: currentJobTitle }
      : null

    const access_card = store.getEditedAccessCard(
      employee.id,
      employee.accessCard,
    )

    const originalName = employee.name.split(' ')
    const originalLastname = originalName[0]
    const originalFirstname = originalName.slice(1).join(' ')
    const lastname = store.getEditedLastname(employee.id) || originalLastname
    const firstname = store.getEditedFirstname(employee.id) || originalFirstname

    return (
      <tr key={employee.id}>
        <td>
          <Label xs fontSize={'.7rem'}>
            {index + 1}
          </Label>
        </td>
        <td>
          <Label xs>{employee.card}</Label>
        </td>

        <td>
          <Input
            size="sm"
            variant="plain"
            value={lastname}
            sx={{ fontSize: '.8rem' }}
            onChange={e => store.setEditedLastname(employee.id, e.target.value)}
            onBlur={() => store.saveName(employee.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') store.saveName(employee.id)
              if (e.key === 'Escape') store.cancelEdit(employee.id)
            }}
          />
        </td>
        <td>
          <Input
            size="sm"
            variant="plain"
            value={firstname}
            sx={{ fontSize: '.8rem' }}
            onChange={e =>
              store.setEditedFirstname(employee.id, e.target.value)
            }
            onBlur={() => store.saveName(employee.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') store.saveName(employee.id)
              if (e.key === 'Escape') store.cancelEdit(employee.id)
            }}
          />
        </td>
        <td>
          <BaseAutocomplete
            freeSolo
            size="sm"
            variant="plain"
            options={store.jobTitles}
            value={currentJobTitleOption}
            sx={{ fontSize: '.8rem' }}
            onChange={newValue =>
              store.setEditedJobTitle(employee.id, newValue?.value ?? '')
            }
            onBlur={() => store.saveJobTitle(employee.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') store.saveJobTitle(employee.id)
              if (e.key === 'Escape') store.cancelEdit(employee.id)
            }}
          />
        </td>
        <td>
          <Input
            size="sm"
            variant="plain"
            value={access_card}
            sx={{ fontSize: '.8rem' }}
            onChange={e =>
              store.setEditedAccessCard(employee.id, e.target.value)
            }
            onBlur={() => store.saveAccessCard(employee.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') store.saveAccessCard(employee.id)
              if (e.key === 'Escape') store.cancelEdit(employee.id)
            }}
          />
        </td>
        <td>
          <Label xs fontSize={'.7rem'}>
            {employee.daysSinceLastEvent ?? '—'}
          </Label>
        </td>
        <td>
          <DeleteEmployeeDialog
            handler={() => store.delete(employee.id)}
            employee={employee}
          >
            <DeleteIcon />
          </DeleteEmployeeDialog>
        </td>
      </tr>
    )
  },
)
