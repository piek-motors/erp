import type { ReactNode } from 'react'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface IDeleteOrderDialogProps {
  handler: () => void
  children: ReactNode
}

export function DeleteOrderDialog({
  handler,
  children,
}: IDeleteOrderDialogProps) {
  const title = ''
  const body = 'Удаление заказа / рекламации необратимо.'
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
