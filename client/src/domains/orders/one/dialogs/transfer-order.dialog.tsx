import { ConfirmDialog } from 'components/confirm-dialog'
import type { ReactNode } from 'react'

interface ITransferOrderDialogProps {
  handler: () => void
  children: ReactNode
}

export function TransferOrderDialog({
  handler,
  children,
}: ITransferOrderDialogProps) {
  const title = 'Перенести в архив?'
  const body =
    'Заказ удалится из очередности, но его в любое время можно будет найти в архиве по номеру счета или контрагенту'

  return (
    <ConfirmDialog
      title={title}
      body={body}
      confirmButtonHandler={handler}
      confirmButtonLabel="Перенести"
    >
      {children}
    </ConfirmDialog>
  )
}
