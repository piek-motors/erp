import { Button } from '@mui/joy'
import { InModal } from 'components/modal'
import { OperationsList } from 'metalflow/operations/list'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

export const OperationsListModal = observer(
  (props: { materialId?: number }) => {
    const [open, setOpen] = useState(false)
    return (
      <InModal
        open={open}
        setOpen={open => {
          setOpen(open)
        }}
        openButton={
          <Button variant="soft" color="neutral">
            Журнал операций
          </Button>
        }
      >
        <OperationsList materialId={props.materialId} />
      </InModal>
    )
  }
)
