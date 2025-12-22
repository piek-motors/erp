import { Box, Button, ButtonProps } from '@mui/joy'
import { InModal } from 'components/modal'
import { Btn } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useEscapeClose } from '../../../hooks/use-escape-close'
import { OperationsTable, OperationsTitle } from './list'

type OperationModalProps = {
  children: React.ReactNode
  btn: {
    label: string
    color: ButtonProps['color']
  }
  open: boolean
  setOpen: (open: boolean) => void
}

export const OperationModal = observer(
  ({ children, btn, open, setOpen }: OperationModalProps) => {
    const handleClose = useCallback(() => {
      setOpen(false)
    }, [])
    useEscapeClose(open, handleClose)
    return (
      <InModal
        size="sm"
        openButton={
          <Btn variant="soft" color={btn.color} fullWidth>
            {btn.label}
          </Btn>
        }
        open={open}
        setOpen={o => setOpen(o)}
      >
        {children}
      </InModal>
    )
  }
)

export const OperationsListModal = observer(
  (props: { materialId?: number; detailId?: number }) => {
    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => {
      setOpen(false)
    }, [])
    useEscapeClose(open, handleClose)
    return (
      <InModal
        open={open}
        setOpen={open => {
          setOpen(open)
        }}
        openButton={
          <Button fullWidth variant="soft" color="neutral">
            Журнал
          </Button>
        }
      >
        <Box>
          <OperationsTitle />
          <OperationsTable
            materialId={props.materialId}
            detailId={props.detailId}
          />
        </Box>
      </InModal>
    )
  }
)
