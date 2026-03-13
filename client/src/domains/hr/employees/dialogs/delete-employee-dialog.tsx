import type { ReactNode } from 'react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Employee } from '../employee.store'

interface IDeleteEmployeeDialogProps {
  handler: () => void
  children: ReactNode
  employee: Employee
}

export function DeleteEmployeeDialog({
  handler,
  children,
  employee,
}: IDeleteEmployeeDialogProps) {
  const title = ''
  const body = `Удалить сотрудника ${employee.first_name} ${employee.job_title}`
  return (
    <ConfirmDialog
      isDangerous
      title={title}
      body={body}
      confirmButtonHandler={handler}
      confirmButtonLabel="Удалить"
    >
      {children}
    </ConfirmDialog>
  )
}
