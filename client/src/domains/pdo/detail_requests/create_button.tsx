import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { IconButton, type IconButtonProps, Tooltip } from '@mui/joy'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { UseIcon } from '@/lib'
import { DetailRequestFormModal } from './form'
import type { DetailRequestFormDetail } from './form.store'

export const createDetailRequestTooltip = 'Создать требование'

export const CreateDetailRequestIcon = (
  props: ComponentProps<typeof ReceiptLongIcon>,
) => <ReceiptLongIcon {...props} />

export const CreateDetailRequestButton = (
  props: Omit<IconButtonProps, 'onClick'> & {
    initialOrderId?: number | string
    initialProductName?: string
    initialProductQty?: number
    initialDetails?: DetailRequestFormDetail[]
    onSaved?(): Promise<void> | void
  },
) => {
  const {
    initialOrderId,
    initialProductName,
    initialProductQty,
    initialDetails,
    onSaved,
    ...buttonProps
  } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip title={createDetailRequestTooltip} size="sm">
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          {...buttonProps}
          onClick={event => {
            event.stopPropagation()
            setOpen(true)
          }}
        >
          <UseIcon icon={ReceiptLongIcon} small />
        </IconButton>
      </Tooltip>
      <DetailRequestFormModal
        open={open}
        setOpen={setOpen}
        initialOrderId={initialOrderId}
        initialProductName={initialProductName}
        initialProductQty={initialProductQty}
        initialDetails={initialDetails}
        onSaved={onSaved}
      />
    </>
  )
}
