import { Button } from '@mui/joy'
import { InModal } from 'components/modal'
import { Btn } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useEscapeClose } from '../../../hooks/use-escape-close'
import { OperationsList } from './list'

type OperationModalProps = {
  children: React.ReactNode
  buttonLabel: string
  buttonColor: 'danger' | 'success'
}

export const OperationModal = observer(
  ({ children, buttonLabel, buttonColor }: OperationModalProps) => {
    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => {
      setOpen(false)
    }, [])
    useEscapeClose(open, handleClose)
    return (
      <InModal
        size="sm"
        openButton={
          <Btn variant="soft" color={buttonColor} fullWidth>
            {buttonLabel}
          </Btn>
        }
        open={open}
        setOpen={setOpen}
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
        size="sm"
        open={open}
        setOpen={open => {
          setOpen(open)
        }}
        openButton={
          <Button variant="soft" color="neutral" fullWidth>
            Журнал операций
          </Button>
        }
      >
        <OperationsList
          materialId={props.materialId}
          detailId={props.detailId}
        />
      </InModal>
    )
  }
)
