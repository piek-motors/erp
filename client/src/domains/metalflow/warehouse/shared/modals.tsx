import { InModal } from 'components/modal'
import { MetalPageTitle } from 'domains/metalflow/shared'
import { Btn, Stack } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useEscapeClose } from './use-escape-close'

type OperationModalProps = {
  children: React.ReactNode
  buttonLabel: string
  buttonColor: 'danger' | 'success'
}

const OperationModal = observer(
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
          <Btn variant="soft" color={buttonColor}>
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

import { Button } from '@mui/joy'
import { OperationsList } from '../list'

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
          <Button variant="soft" color="neutral">
            Операции
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

export const WriteoffModal = observer(
  (props: { children: React.ReactNode }) => (
    <OperationModal buttonLabel="Списание" buttonColor="danger">
      <MetalPageTitle t="Списание" />
      <Stack gap={1} my={1}>
        {props.children}
      </Stack>
    </OperationModal>
  )
)

export const SupplyModal = observer((props: { children: React.ReactNode }) => (
  <OperationModal buttonLabel="Поставка" buttonColor="success">
    <MetalPageTitle t="Поставка" />
    <Stack gap={1} my={1}>
      {props.children}
    </Stack>
  </OperationModal>
))
