import { InModal } from 'components/modal'
import { MetalPageTitle } from 'domains/metalflow/shared'
import { Btn, Stack } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'

type OperationModalProps = {
  children: React.ReactNode
  buttonLabel: string
  buttonColor: 'danger' | 'success'
}

const OperationModal = observer(
  ({ children, buttonLabel, buttonColor }: OperationModalProps) => {
    const [open, setOpen] = useState(false)

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
        }
      },
      [open]
    )

    useEffect(() => {
      if (open) {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
      }
    }, [open, handleKeyDown])

    return (
      <InModal
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
import { OperationsList } from './list'

export const OperationsListModal = observer(
  (props: { materialId?: number; detailId?: number }) => {
    const [open, setOpen] = useState(false)
    return (
      <InModal
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
      <Stack gap={2}>{props.children}</Stack>
    </OperationModal>
  )
)

export const SupplyModal = observer((props: { children: React.ReactNode }) => (
  <OperationModal buttonLabel="Поставка" buttonColor="success">
    <MetalPageTitle t="Поставка" />
    <Stack gap={2}>{props.children}</Stack>
  </OperationModal>
))
